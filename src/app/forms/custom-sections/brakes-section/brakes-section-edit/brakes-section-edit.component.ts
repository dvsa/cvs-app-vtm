import { Component, OnDestroy, OnInit, inject, input, output } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { PSVAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/psv/skeleton';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { GovukFormGroupAutocompleteComponent } from '@forms/components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
import { GovukFormGroupCheckboxComponent } from '@forms/components/govuk-form-group-checkbox/govuk-form-group-checkbox.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { GovukFormGroupSelectComponent } from '@forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { YES_NO_OPTIONS } from '@models/options.model';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Retarders, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { FormNodeEditTypes, FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { MultiOptionsService } from '@services/multi-options/multi-options.service';
import { selectBrakeByCode } from '@store/reference-data';
import { addAxle, removeAxle, updateBrakeForces, updateEditingTechRecord } from '@store/technical-records';
import { ReplaySubject, debounceTime, distinctUntilChanged, map, switchMap, takeUntil, withLatestFrom } from 'rxjs';

@Component({
	selector: 'app-brakes-section-edit',
	templateUrl: './brakes-section-edit.component.html',
	styleUrls: ['./brakes-section-edit.component.scss'],
	imports: [
		ReactiveFormsModule,
		GovukFormGroupInputComponent,
		GovukFormGroupRadioComponent,
		GovukFormGroupCheckboxComponent,
		GovukFormGroupSelectComponent,
		GovukFormGroupAutocompleteComponent,
	],
})
export class BrakesSectionEditComponent extends EditBaseComponent implements OnInit, OnDestroy {
	actions = inject(Actions);
	optionsService = inject(MultiOptionsService);

	FormNodeWidth = FormNodeWidth;
	VehicleTypes = VehicleTypes;
	TagType = TagType;
	TagTypeLabels = TagTypeLabels;

	brakeCodeOptions$ = this.optionsService
		.getOptions(ReferenceDataResourceType.Brakes)
		.pipe(map((options) => options?.map((option) => option.value) ?? []));

	booleanOptions = YES_NO_OPTIONS;
	retarderOptions = getOptionsFromEnum(Retarders);

	techRecord = input.required<TechRecordType<'trl' | 'psv'>>();

	destroy$ = new ReplaySubject<boolean>(1);

	form: FormGroup = this.fb.group({});

	readonly formChange = output<Record<string, unknown>>();

	ngOnInit(): void {
		this.optionsService.loadOptions(ReferenceDataResourceType.Brakes);

		this.addControls(this.controlsBasedOffVehicleType, this.form);
		this.prepopulateAxles();
		this.checkAxleAdded();
		this.checkAxleRemoved();
		this.handleBrakeCodeChange();
		this.handleAxleChanges();

		// Attach all form controls to parent
		this.init(this.form);
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	prepopulateAxles() {
		this.techRecord().techRecord_axles?.forEach((axle) => {
			const form = this.getAxleForm();
			form.patchValue(axle as any, { emitEvent: false });
			this.axles.push(form, { emitEvent: false });
		});
	}

	checkAxleAdded() {
		this.actions
			.pipe(ofType(addAxle), takeUntil(this.destroy$), withLatestFrom(this.technicalRecordService.techRecord$))
			.subscribe(([_, techRecord]) => {
				if (techRecord) {
					const axles = (techRecord as TechRecordType<'hgv' | 'trl' | 'psv'>).techRecord_axles || [];
					const form = this.getAxleForm();
					form.patchValue(axles[axles.length - 1], { emitEvent: false });
					this.axles.push(form, { emitEvent: false });
					this.axles.patchValue(axles, { emitEvent: false });
				}
			});
	}

	checkAxleRemoved() {
		this.actions
			.pipe(ofType(removeAxle), takeUntil(this.destroy$), withLatestFrom(this.technicalRecordService.techRecord$))
			.subscribe(([_, techRecord]) => {
				if (techRecord) {
					const axles = (techRecord as TechRecordType<'hgv' | 'trl' | 'psv'>).techRecord_axles || [];
					this.axles.removeAt(0, { emitEvent: false });
					this.axles.patchValue(axles, { emitEvent: false });
				}
			});
	}

	getAxleForm() {
		const techRecord = this.techRecord();
		if (techRecord.techRecord_vehicleType === VehicleTypes.PSV) return this.addPsvAxleBrakesInformation();
		return this.addTrlAxleBrakesInformation();
	}

	addTrlAxleBrakesInformation() {
		return this.fb.group({
			brakes_brakeActuator: this.fb.control<number | null>(null, [
				this.commonValidators.max(999, 'This field must be less than or equal to 999'),
			]),
			brakes_leverLength: this.fb.control<number | null>(null, [
				this.commonValidators.max(999, 'This field must be less than or equal to 999'),
			]),
			brakes_springBrakeParking: this.fb.control<boolean | null>(null, []),
			parkingBrakeMrk: this.fb.control<boolean | null>(false, []),
			axleNumber: this.fb.control<number | null>(null, []),
		});
	}

	addPsvAxleBrakesInformation() {
		return this.fb.group({
			parkingBrakeMrk: this.fb.control<boolean | null>(false, []),
			axleNumber: this.fb.control<number | null>(null, []),
		});
	}

	getPSV(techRecord: TechRecordType<'trl' | 'psv'>) {
		return techRecord as TechRecordType<'psv'>;
	}

	handleBrakeCodeChange() {
		const techRecord = this.techRecord();
		if (techRecord.techRecord_vehicleType !== VehicleTypes.PSV) return;

		const brakeCode = this.form.get('techRecord_brakes_brakeCodeOriginal');
		if (!brakeCode) return;

		brakeCode.valueChanges
			.pipe(
				takeUntil(this.destroy$),
				switchMap((value) => this.store.select(selectBrakeByCode(value))),
				withLatestFrom(brakeCode.valueChanges),
				debounceTime(400),
				distinctUntilChanged()
			)
			.subscribe(([selectedBrake, value]) => {
				// Set the brake details automatically based selection
				if (selectedBrake && value) {
					const techRecord_brakeCode = `${this.brakeCodePrefix}${selectedBrake.resourceKey}`;
					const techRecord_brakes_brakeCode = `${this.brakeCodePrefix}${selectedBrake.resourceKey}`;
					const techRecord_brakes_dataTrBrakeOne = selectedBrake.service;
					const techRecord_brakes_dataTrBrakeTwo = selectedBrake.secondary;
					const techRecord_brakes_dataTrBrakeThree = selectedBrake.parking;

					const changes = {
						techRecord_brakeCode,
						techRecord_brakes_brakeCode,
						techRecord_brakes_dataTrBrakeOne,
						techRecord_brakes_dataTrBrakeTwo,
						techRecord_brakes_dataTrBrakeThree,
					};

					this.form.patchValue(changes, { emitEvent: false });
					this.store.dispatch(updateEditingTechRecord({ vehicleTechRecord: changes } as any));
				}

				const axlesValue = this.form.get('techRecord_axles')?.value as PSVAxles[];

				if (axlesValue && Array.isArray(axlesValue)) {
					const techRecord_axles = axlesValue.filter((axle) => !!axle?.axleNumber);
					const changes = { techRecord_axles };
					this.form.patchValue(changes, { emitEvent: false });
				}

				if (value) {
					this.store.dispatch(updateBrakeForces({}));
				}
			});
	}

	handleAxleChanges() {
		const techRecord = this.techRecord();

		if (techRecord.techRecord_vehicleType === VehicleTypes.TRL) {
			this.axles.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((axles) => {
				this.formChange.emit({ techRecord_axles: axles });
			});
		}
	}

	get vehicleType(): VehicleTypes {
		return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord());
	}

	get controlsBasedOffVehicleType() {
		if (this.vehicleType === VehicleTypes.TRL) {
			return this.trlOnlyFields;
		}
		if (this.vehicleType === VehicleTypes.PSV) {
			return this.psvOnlyFields;
		}
		return {};
	}

	public get psvOnlyFields(): Partial<Record<keyof TechRecordType<'psv'>, FormControl | FormArray>> {
		return {
			techRecord_axles: this.fb.array([]),
			techRecord_brakes_brakeCode: this.fb.control<string | null>(null, []),
			techRecord_brakes_brakeCodeOriginal: this.fb.control<string | null>(null),
			techRecord_brakes_dataTrBrakeOne: this.fb.control<string | null>({ value: null, disabled: true }, []),
			techRecord_brakes_dataTrBrakeTwo: this.fb.control<string | null>({ value: null, disabled: true }, []),
			techRecord_brakes_dataTrBrakeThree: this.fb.control<string | null>({ value: null, disabled: true }, []),
			techRecord_brakes_retarderBrakeOne: this.fb.control<string | null>(null, []),
			techRecord_brakes_retarderBrakeTwo: this.fb.control<string | null>(null, []),
		};
	}

	public get trlOnlyFields(): Partial<Record<keyof TechRecordType<'trl'>, FormControl | FormArray>> {
		return {
			techRecord_brakes_loadSensingValve: this.fb.control<boolean | null>(null, []),
			techRecord_brakes_antilockBrakingSystem: this.fb.control<boolean | null>(null, []),
			techRecord_axles: this.fb.array([]),
		};
	}

	get editTypes(): typeof FormNodeEditTypes {
		return FormNodeEditTypes;
	}

	get widths(): typeof FormNodeWidth {
		return FormNodeWidth;
	}

	get brakeCodePrefix(): string {
		const vehicleTechRecord = this.techRecord();
		if (vehicleTechRecord.techRecord_vehicleType !== 'psv' || !vehicleTechRecord?.techRecord_grossLadenWeight) {
			return '';
		}
		const prefix = `${Math.round(vehicleTechRecord.techRecord_grossLadenWeight / 100)}`;

		return prefix.length <= 2 ? `0${prefix}` : prefix;
	}

	get axles() {
		return this.form.get('techRecord_axles') as FormArray;
	}

	round(n: number): number {
		return Math.round(n);
	}
}
