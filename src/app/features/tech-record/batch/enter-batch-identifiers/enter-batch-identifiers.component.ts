import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
import { GlobalError } from '@/src/app/core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@/src/app/core/components/global-error/global-error.service';
import { NoSpaceDirective } from '@/src/app/directives/app-no-space/app-no-space.directive';
import { ToUppercaseDirective } from '@/src/app/directives/app-to-uppercase/app-to-uppercase.directive';
import { TrimWhitespaceDirective } from '@/src/app/directives/app-trim-whitespace/app-trim-whitespace.directive';
import { GovukFormGroupInputComponent } from '@/src/app/forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { BatchRoutes, RootRoutes } from '@/src/app/models/routes.enum';
import { SEARCH_TYPES } from '@/src/app/models/search-types-enum';
import { StatusCodes, VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { HttpService } from '@/src/app/services/http/http.service';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { updateBatch, upsertBatchVehicles } from '@/src/app/store/batch/batch.actions';
import { BatchRecord } from '@/src/app/store/batch/batch.models';
import { selectBatchDetails, selectBatchVehicleTypeDescriptor } from '@/src/app/store/batch/batch.selectors';
import { Component, DestroyRef, OnInit, computed, effect, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
	AbstractControl,
	AsyncValidatorFn,
	FormBuilder,
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	ValidationErrors,
	ValidatorFn,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { Store } from '@ngrx/store';
import { Observable, catchError, filter, map, of, take } from 'rxjs';

@Component({
	selector: 'app-enter-batch-identifiers',
	templateUrl: './enter-batch-identifiers.component.html',
	styleUrls: ['./enter-batch-identifiers.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		ButtonComponent,
		ButtonGroupComponent,
		GovukFormGroupInputComponent,
		ToUppercaseDirective,
		NoSpaceDirective,
		TrimWhitespaceDirective,
	],
})
export class EnterBatchIdentifiers implements OnInit {
	readonly fb = inject(FormBuilder);
	readonly router = inject(Router);
	readonly store = inject(Store);
	readonly title = inject(Title);
	readonly validators = inject(CommonValidatorsService);
	readonly errorService = inject(GlobalErrorService);
	readonly httpService = inject(HttpService);
	readonly technicalRecordService = inject(TechnicalRecordService);
	readonly destroyRef = inject(DestroyRef);
	readonly activatedRoute = inject(ActivatedRoute);

	readonly queryParamMap = toSignal(this.activatedRoute.queryParamMap);
	readonly redirectUrl = computed(() => this.queryParamMap()?.get('redirectUrl'));
	readonly savedBatchDetails = this.store.selectSignal(selectBatchDetails);
	readonly vehicleTypeDescriptor = this.store.selectSignal(selectBatchVehicleTypeDescriptor);
	readonly pageTitle = computed(() => this.computePageTitle());
	readonly duplicateVins: string[] = [];

	readonly VehicleTypes = VehicleTypes;

	readonly form = this.fb.group({
		vehicles: this.fb.array<FormGroup<VehicleForm>>([]),
	});

	constructor() {
		effect(() => this.title.setTitle(`${this.pageTitle()} - Vehicle Testing Management`));
	}

	ngOnInit(): void {
		this.handlePopulateForm();
	}

	computePageTitle(): string {
		return `Enter details for each ${this.vehicleTypeDescriptor()}`;
	}

	handlePopulateForm(): void {
		const { vehicleType, batchSize, vehicles } = this.savedBatchDetails();
		if (!vehicleType || !batchSize) return;

		this.addVehicles(vehicleType, batchSize);

		// Restore batch details if returning to this page
		this.form.patchValue({ vehicles });
		this.form.markAllAsTouched();
	}

	addVehicles(vehicleType: VehicleTypes, batchSize: number): void {
		for (let i = 0; i < batchSize; i++) {
			this.addVehicle(vehicleType, i);
		}
	}

	addVehicle(vehicleType: VehicleTypes, index: number) {
		const form = this.fb.group<VehicleForm>({
			id: this.fb.nonNullable.control<number>(index),
			systemNumber: this.fb.control<string | null>(''),
			createdTimestamp: this.fb.control<string | null>(''),
			vehicleType: this.fb.nonNullable.control<string>(vehicleType),
			vin: this.fb.control<string | null>(null, {
				updateOn: 'blur',
				validators: [
					this.validators.alphanumeric(() => ({
						error: `Vehicle ${index + 1} - VIN must be alphanumeric`,
						anchorLink: `vin-${index}`,
					})),
					this.validators.minLength(3, () => ({
						error: `Vehicle ${index + 1} - VIN must be greater than or equal to 3 characters`,
						anchorLink: `vin-${index}`,
					})),
					this.validators.maxLength(21, () => ({
						error: `Vehicle ${index + 1} - VIN must be less than or equal to 21 characters`,
						anchorLink: `vin-${index}`,
					})),
					this.validators.pattern('^(?!.*[OIQoij]).*$', () => ({
						error: `Vehicle ${index + 1} - VIN should not contain O, I or Q`,
						anchorLink: `vin-${index}`,
					})),
					// Checked last so that a badly formatted VIN reports its format error first
					this.validateVinIsNotDuplicated(index),
				],
				asyncValidators: [this.validateVehicle(index, vehicleType)],
			}),
			trailerIdOrVrm: this.fb.control<string | null>(null, {
				updateOn: 'blur',
				validators: [
					this.validators.applyWhen(
						() => vehicleType === VehicleTypes.TRL,
						this.validators.alphanumeric(() => ({
							error: `Vehicle ${index + 1} - Trailer ID must be alphanumeric`,
							anchorLink: `trailerIdOrVrm-${index}`,
						})),
						this.validators.minLength(7, () => ({
							error: `Vehicle ${index + 1} - Trailer ID must be greater than or equal to 7 characters`,
							anchorLink: `trailerIdOrVrm-${index}`,
						})),
						this.validators.maxLength(8, () => ({
							error: `Vehicle ${index + 1} - Trailer ID must be less than or equal to 8 characters`,
							anchorLink: `trailerIdOrVrm-${index}`,
						}))
					),
					this.validators.applyWhen(
						() => vehicleType === VehicleTypes.HGV || vehicleType === VehicleTypes.PSV,
						this.validators.alphanumeric(() => ({
							error: `Vehicle ${index + 1} - VRM must be alphanumeric`,
							anchorLink: `trailerIdOrVrm-${index}`,
						})),
						this.validators.minLength(1, () => ({
							error: `Vehicle ${index + 1} - VRM must be greater than or equal to 1 character`,
							anchorLink: `trailerIdOrVrm-${index}`,
						})),
						this.validators.maxLength(9, () => ({
							error: `Vehicle ${index + 1} - VRM must be less than or equal to 9 characters`,
							anchorLink: `trailerIdOrVrm-${index}`,
						}))
					),
				],
				asyncValidators: [this.validateVehicle(index, vehicleType)],
			}),
		});

		form.controls.vin.valueChanges
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((vin) => this.revalidateDuplicateVins(index, vin));

		this.form.controls.vehicles.push(form, { emitEvent: false });
	}

	validateVinIsNotDuplicated(index: number): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const vin = control.value?.toUpperCase();
			if (!vin) return null;

			const isDuplicate = this.form.controls.vehicles.controls.some(
				(vehicle, position) => position < index && vehicle.controls.vin.value?.toUpperCase() === vin
			);

			if (!isDuplicate) return null;

			return { duplicateVin: { error: `Vehicle ${index + 1} - Remove duplicate VIN`, anchorLink: `vin-${index}` } };
		};
	}

	revalidateDuplicateVins(index: number, vin: string | null): void {
		this.form.controls.vehicles.controls.forEach((vehicle, position) => {
			if (position === index) return;

			// Only vehicles using the new VIN, or already reported as duplicates, can have changed
			const control = vehicle.controls.vin;
			if (control.value === vin || control.hasError('duplicateVin')) {
				control.updateValueAndValidity({ emitEvent: false });
			}
		});
	}

	validateVehicleForCreate(form: FormGroup<VehicleForm>): Observable<ValidationErrors | null> {
		const vin = form.getRawValue().vin?.toUpperCase();
		if (!vin) return of(null);

		return this.technicalRecordService.isUnique(vin, SEARCH_TYPES.VIN).pipe(
			map((isUnique) => {
				if (!isUnique) {
					this.duplicateVins.push(vin);
				}

				return null;
			}),
			catchError(() => of(null))
		);
	}

	validateVehicleForUpdate(
		form: FormGroup<VehicleForm>,
		index: number,
		vehicleType: VehicleTypes
	): Observable<ValidationErrors | null> {
		const vehicle = form.getRawValue();
		if (!vehicle.vin) return of(null);

		// Ensure identifiers are uppercase
		const vin = vehicle.vin.toUpperCase();
		const trailerIdOrVrm = vehicle.trailerIdOrVrm?.toUpperCase();

		return this.httpService.searchTechRecords(SEARCH_TYPES.VIN, vin).pipe(
			map((results) => {
				const matches = results.filter(
					(result) => result.trailerId === trailerIdOrVrm || result.primaryVrm === trailerIdOrVrm
				);

				// Errors are anchored to the VIN so that selecting them moves focus to the vehicle they belong to
				const identifier = vehicleType === VehicleTypes.TRL ? 'Trailer ID' : 'VRM';
				const anchorLink = `vin-${index}`;

				if (matches.length === 0) {
					const error = {
						vehicle: {
							error: `Vehicle ${index + 1} - Could not find a record with matching VIN and ${identifier}`,
							anchorLink,
						},
					};

					// Apply error to both VIN and VRM/Trailer ID simultaneously
					form.controls.vin.setErrors({ ...form.controls.vin.errors, ...error });
					form.controls.trailerIdOrVrm.setErrors({ ...form.controls.trailerIdOrVrm.errors, ...error });

					return error;
				}

				const uniqueRecords = new Set(matches.map((record) => record.systemNumber));
				if (uniqueRecords.size > 1) {
					const error = {
						vehicle: {
							error: `Vehicle ${index + 1} - More than one vehicle has this VIN and ${identifier}`,
							anchorLink,
						},
					};

					// Apply error to both VIN and VRM/Trailer ID simultaneously
					form.controls.vin.setErrors({ ...form.controls.vin.errors, ...error });
					form.controls.trailerIdOrVrm.setErrors({ ...form.controls.trailerIdOrVrm.errors, ...error });

					return error;
				}

				const vehicleToUpdate = matches.find((record) => record.techRecord_statusCode !== StatusCodes.ARCHIVED);
				if (vehicleToUpdate) {
					form.patchValue(
						{
							systemNumber: vehicleToUpdate.systemNumber,
							createdTimestamp: vehicleToUpdate.createdTimestamp,
						},
						{ emitEvent: false }
					);
				}

				// Clear vehicle error from VIN
				if (form.controls.vin.errors && form.controls.vin.hasError('vehicle')) {
					const { vehicle, ...errors } = form.controls.vin.errors;
					form.controls.vin.setErrors(Object.values(errors).length > 0 ? errors : null);
				}

				// Clear vehicle error from VRM/Trailer ID
				if (form.controls.trailerIdOrVrm.errors && form.controls.trailerIdOrVrm.hasError('vehicle')) {
					const { vehicle, ...errors } = form.controls.trailerIdOrVrm.errors;
					form.controls.trailerIdOrVrm.setErrors(Object.values(errors).length > 0 ? errors : null);
				}

				return null;
			}),
			catchError(() =>
				of({
					vehicle: {
						error: `Vehicle ${index + 1} - Could not find a record with matching VIN`,
						anchorLink: `vin-${index}`,
					},
				})
			)
		);
	}

	validateVehicle(index: number, vehicleType: VehicleTypes): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			if (!control.parent || control.errors) return of(null);

			const form = control.parent as FormGroup<VehicleForm>;
			const vehicle = form.getRawValue();

			if (vehicle.trailerIdOrVrm) {
				if (!vehicle.vin) {
					return of({ vin: { error: `Vehicle ${index + 1} - VIN is required`, anchorLink: `vin-${index}` } });
				}

				return this.validateVehicleForUpdate(form, index, vehicleType);
			}

			return this.validateVehicleForCreate(form);
		};
	}

	handleAddVehicle(): void {
		const { vehicleType } = this.savedBatchDetails();
		if (!vehicleType) return;

		const size = this.form.controls.vehicles.length;
		this.addVehicle(vehicleType, size);
	}

	// Errors are read from the vehicles as they stand, rather than by re-running validation, because
	// re-running validation clears the results of the VIN and VRM checks before they can be collected
	extractVehicleErrors(): GlobalError[] {
		const errors: GlobalError[] = this.form.controls.vehicles.controls.flatMap((vehicle) =>
			Object.values(vehicle.controls).flatMap((control) => {
				// Only report the first error of each field to prevent duplication
				const [error] = Object.values(control.errors ?? {});
				return error ? [{ error: error.error, anchorLink: error.anchorLink }] : [];
			})
		);

		// The VIN and VRM are validated together, so both fields report the same error
		return errors.filter((error, position) => errors.findIndex((it) => it.error === error.error) === position);
	}

	handleConfirm(): void {
		this.form.markAllAsTouched();

		// Checking a VIN and VRM against existing records calls the API, so wait for any checks that
		// are still running, otherwise the batch is confirmed before their errors are known
		if (this.form.status === 'PENDING') {
			this.form.statusChanges
				.pipe(
					filter((status) => status !== 'PENDING'),
					take(1),
					takeUntilDestroyed(this.destroyRef)
				)
				.subscribe(() => this.handleConfirm());

			return;
		}

		const value = this.form.getRawValue();
		const errors = this.extractVehicleErrors();

		// Ensure at least one vehicle has a VIN
		const vins = value.vehicles.filter((vehicle) => !!vehicle.vin);
		if (vins.length === 0) {
			errors.push({ error: 'At least 1 vehicle must have a VIN', anchorLink: 'vin-0' });
		}

		if (errors.length > 0) {
			this.errorService.setErrors(errors);
		}

		if (errors.length === 0) {
			const savedBatchDetails = this.savedBatchDetails();
			this.technicalRecordService.updateEditingTechRecord({
				techRecord_statusCode: savedBatchDetails.vehicleStatus,
				techRecord_vehicleType: savedBatchDetails.vehicleType,
			} as TechRecordType<'put'>);
			this.technicalRecordService.generateEditingVehicleTechnicalRecordFromVehicleType(
				savedBatchDetails.vehicleType as VehicleTypes
			);
			this.technicalRecordService.clearSectionTemplateStates();
			this.store.dispatch(updateBatch({ changes: { batchSize: vins.length } }));
			this.store.dispatch(upsertBatchVehicles({ vehicles: value.vehicles as BatchRecord[] }));

			const redirectUrl = this.redirectUrl();
			if (redirectUrl) {
				return void this.router.navigate([redirectUrl]);
			}

			return void this.router.navigate([RootRoutes.BATCH, BatchRoutes.ENTER_TECH_RECORD_DETAILS]);
		}
	}

	handleCancel(): void {
		// Save unsaved changes before leaving the page
		const value = this.form.getRawValue();
		this.store.dispatch(upsertBatchVehicles({ vehicles: value.vehicles as BatchRecord[] }));

		this.router.navigate([RootRoutes.BATCH, BatchRoutes.CANCEL_BATCH]);
	}
}

export type VehicleForm = {
	id: FormControl<number | null>;
	vin: FormControl<string | null>;
	trailerIdOrVrm: FormControl<string | null>;
	vehicleType: FormControl<string>;
	createdTimestamp: FormControl<string | null>;
	systemNumber: FormControl<string | null>;
};
