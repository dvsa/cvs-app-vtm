import { ButtonGroupComponent } from '@/src/app/components/button-group/button-group.component';
import { ButtonComponent } from '@/src/app/components/button/button.component';
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
import { upsertVehicleBatch } from '@/src/app/store/technical-records/batch-create.actions';
import { BatchRecord } from '@/src/app/store/technical-records/batch-create.reducer';
import {
	selectBatchDetails,
	selectBatchVehicleTypeDescriptor,
} from '@/src/app/store/technical-records/batch-create.selectors';
import { Component, OnInit, computed, effect, inject } from '@angular/core';
import {
	AbstractControl,
	AsyncValidatorFn,
	FormBuilder,
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	ValidationErrors,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, catchError, map, of } from 'rxjs';

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

	readonly savedBatchDetails = this.store.selectSignal(selectBatchDetails);
	readonly vehicleTypeDescriptor = this.store.selectSignal(selectBatchVehicleTypeDescriptor);
	readonly pageTitle = computed(() => this.computePageTitle());
	readonly duplicateVins: string[] = [];

	readonly VehicleTypes = VehicleTypes;

	readonly form = this.fb.group({
		vehicles: this.fb.array<FormGroup<VehicleForm>>([]),
	});

	constructor() {
		effect(() => this.title.setTitle(this.pageTitle()));
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
			systemNumber: this.fb.control<string | null>(''),
			createdTimestamp: this.fb.control<string | null>(''),
			vehicleType: this.fb.nonNullable.control<string>(vehicleType),
			vin: this.fb.control<string | null>(null, {
				updateOn: 'blur',
				validators: [
					this.validators.alphanumeric(() => ({
						error: `Vehicle ${index + 1} VIN must be alphanumeric`,
						anchorLink: `vin-${index}`,
					})),
					this.validators.minLength(3, () => ({
						error: `Vehicle ${index + 1} VIN must be greater than or equal to 3 characters`,
						anchorLink: `vin-${index}`,
					})),
					this.validators.maxLength(21, () => ({
						error: `Vehicle ${index + 1} VIN must be less than or equal to 21 characters`,
						anchorLink: `vin-${index}`,
					})),
					this.validators.pattern('^(?!.*[OIQoij]).*$', () => ({
						error: `Vehicle ${index + 1} VIN should not contain O, I or Q`,
						anchorLink: `vin-${index}`,
					})),
				],
				asyncValidators: [this.validateVehicle(index, vehicleType)],
			}),
			trailerIdOrVrm: this.fb.control<string | null>(null, {
				updateOn: 'blur',
				validators: [
					this.validators.applyWhen(
						() => vehicleType === VehicleTypes.TRL,
						this.validators.alphanumeric(() => ({
							error: `Vehicle ${index + 1} Trailer ID must be alphanumeric`,
							anchorLink: `trailerIdOrVrm-${index}`,
						})),
						this.validators.minLength(7, () => ({
							error: `Vehicle ${index + 1} Trailer ID must be greater than or equal to 7 characters`,
							anchorLink: `trailerIdOrVrm-${index}`,
						})),
						this.validators.maxLength(8, () => ({
							error: `Vehicle ${index + 1} Trailer ID must be less than or equal to 8 characters`,
							anchorLink: `trailerIdOrVrm-${index}`,
						}))
					),
					this.validators.applyWhen(
						() => vehicleType === VehicleTypes.HGV || vehicleType === VehicleTypes.PSV,
						this.validators.alphanumeric(() => ({
							error: `Vehicle ${index + 1} VRM must be alphanumeric`,
							anchorLink: `trailerIdOrVrm-${index}`,
						})),
						this.validators.minLength(1, () => ({
							error: `Vehicle ${index + 1} VRM must be greater than or equal to 1 character`,
							anchorLink: `trailerIdOrVrm-${index}`,
						})),
						this.validators.maxLength(9, () => ({
							error: `Vehicle ${index + 1} VRM must be less than or equal to 9 characters`,
							anchorLink: `trailerIdOrVrm-${index}`,
						}))
					),
				],
				asyncValidators: [this.validateVehicle(index, vehicleType)],
			}),
		});

		this.form.controls.vehicles.push(form, { emitEvent: false });
	}

	validateVehicleForCreate(form: FormGroup<VehicleForm>): Observable<ValidationErrors | null> {
		const vin = form.getRawValue().vin;
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

		return this.httpService.searchTechRecords(SEARCH_TYPES.VIN, vehicle.vin).pipe(
			map((results) => {
				const matches = results.filter(
					(result) => result.trailerId === vehicle.trailerIdOrVrm || result.primaryVrm === vehicle.trailerIdOrVrm
				);

				if (matches.length === 0) {
					if (vehicleType === VehicleTypes.TRL) {
						return {
							vehicle: { error: `Vehicle ${index + 1} - could not find a record with matching VIN and Trailer ID` },
						};
					}

					return { vehicle: { error: `Vehicle ${index + 1} - could not find a record with matching VIN and VRM` } };
				}

				const uniqueRecords = new Set(matches.map((record) => record.systemNumber));
				if (uniqueRecords.size > 1) {
					if (vehicleType === VehicleTypes.TRL) {
						return { vehicle: { error: `Vehicle ${index + 1} - more than one vehicle has this VIN and Trailer ID` } };
					}

					return { vehicle: { error: `Vehicle ${index + 1} - more than one vehicle has this VIN and VRM` } };
				}

				const vehicleToUpdate = matches.find((record) => record.techRecord_statusCode !== StatusCodes.ARCHIVED);
				if (vehicleToUpdate) {
					form.patchValue({
						systemNumber: vehicleToUpdate.systemNumber,
						createdTimestamp: vehicleToUpdate.createdTimestamp,
					});
				}

				return null;
			}),
			catchError(() => of({ vehicle: { error: `Vehicle ${index + 1} - could not find a record with matching VIN` } }))
		);
	}

	validateVehicle(index: number, vehicleType: VehicleTypes): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			if (!control.parent || control.errors) return of(null);

			const form = control.parent as FormGroup<VehicleForm>;
			const vehicle = form.getRawValue();

			if (vehicle.trailerIdOrVrm) {
				if (!vehicle.vin) {
					return of({ vin: { error: `Vehicle ${index + 1} VIN is required` } });
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

	handleConfirm(): void {
		if (this.form.status === 'PENDING') return;

		this.form.markAllAsTouched();

		const value = this.form.getRawValue();
		const errors = this.errorService.extractGlobalErrors(this.form);

		// Ensure at least one vehicle has a VIN
		const vins = value.vehicles.filter((vehicle) => vehicle.vin);
		if (vins.length === 0) {
			errors.push({ error: 'At least 1 vehicle must have a VIN', anchorLink: 'vin-0' });
		}

		if (errors.length > 0) {
			this.errorService.setErrors(errors);
		}

		if (errors.length === 0) {
			this.store.dispatch(upsertVehicleBatch({ vehicles: value.vehicles as BatchRecord[] }));
			this.router.navigate([RootRoutes.BATCH, BatchRoutes.ENTER_TECH_RECORD_DETAILS]);
		}
	}

	handleCancel(): void {
		// Save unsaved changes before leaving the page
		const value = this.form.getRawValue();
		this.store.dispatch(upsertVehicleBatch({ vehicles: value.vehicles as BatchRecord[] }));

		this.router.navigate([RootRoutes.BATCH, BatchRoutes.CANCEL_BATCH]);
	}
}

export type VehicleForm = {
	vin: FormControl<string | null>;
	trailerIdOrVrm: FormControl<string | null>;
	vehicleType: FormControl<string>;
	createdTimestamp: FormControl<string | null>;
	systemNumber: FormControl<string | null>;
};
