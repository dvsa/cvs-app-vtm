import { YES_NO_OPTIONS } from '@/src/app/models/options.model';
import { ReferenceDataResourceType } from '@/src/app/models/reference-data.model';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { selectBrakeByCode } from '@/src/app/store/reference-data';
import { updateBrakeForces, updateEditingTechRecord } from '@/src/app/store/technical-records';
import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PSVAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/psv/skeleton';
import { FieldErrorMessageComponent } from '@forms/components/field-error-message/field-error-message.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { Retarders, V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { ReplaySubject, debounceTime, distinctUntilChanged, map, switchMap, takeUntil, withLatestFrom } from 'rxjs';
import { FieldWarningMessageComponent } from '../../components/field-warning-message/field-warning-message.component';
import { GovukFormGroupAutocompleteComponent } from '../../components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
import { GovukFormGroupCheckboxComponent } from '../../components/govuk-form-group-checkbox/govuk-form-group-checkbox.component';
import { GovukFormGroupInputComponent } from '../../components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '../../components/govuk-form-group-radio/govuk-form-group-radio.component';
import { GovukFormGroupSelectComponent } from '../../components/govuk-form-group-select/govuk-form-group-select.component';
import { getOptionsFromEnum } from '../../utils/enum-map';

@Component({
	selector: 'app-brakes',
	templateUrl: './brakes.component.html',
	styleUrls: ['./brakes.component.scss'],
	imports: [
		ReactiveFormsModule,
		GovukFormGroupInputComponent,
		GovukFormGroupRadioComponent,
		GovukFormGroupCheckboxComponent,
		GovukFormGroupSelectComponent,
		GovukFormGroupAutocompleteComponent,
		FieldWarningMessageComponent,
		FieldErrorMessageComponent,
	],
})
export class BrakesComponent extends EditBaseComponent implements OnInit, OnDestroy {
	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly VehicleTypes = VehicleTypes;
	protected readonly booleanOptions = YES_NO_OPTIONS;
	protected readonly retarderOptions = getOptionsFromEnum(Retarders);

	optionsService = inject(MultiOptionsService);
	techRecord = input.required<V3TechRecordModel>();

	form: FormGroup = this.fb.group({});

	brakeCodeOptions$ = this.optionsService
		.getOptions(ReferenceDataResourceType.Brakes)
		.pipe(map((options) => options?.map((option) => option.value) ?? []));

	destroy$ = new ReplaySubject<boolean>(1);

	ngOnInit(): void {
		this.optionsService.loadOptions(ReferenceDataResourceType.Brakes);

		this.addControls(this.controlsBasedOffVehicleType, this.form);
		this.handleBrakeCodeChange();

		// Attach all form controls to parent
		this.init(this.form);

		// Prepopulate form with current tech record
		this.form.patchValue(this.techRecord());
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	get controlsBasedOffVehicleType() {
		switch (this.techRecord().techRecord_vehicleType) {
			case VehicleTypes.PSV:
				return this.psvControls;
			case VehicleTypes.TRL:
				return this.trlControls;
			default:
				return {};
		}
	}

	get techRecordAxles() {
		return this.parent.get('techRecord_axles') as FormArray;
	}

	get psvControls() {
		return {
			techRecord_brakes_brakeCode: this.fb.control<string | null>(null, []),
			techRecord_brakes_brakeCodeOriginal: this.fb.control<string | null>(null),
			techRecord_brakes_dataTrBrakeOne: this.fb.control<string | null>({ value: null, disabled: true }, []),
			techRecord_brakes_dataTrBrakeTwo: this.fb.control<string | null>({ value: null, disabled: true }, []),
			techRecord_brakes_dataTrBrakeThree: this.fb.control<string | null>({ value: null, disabled: true }, []),
			techRecord_brakes_retarderBrakeOne: this.fb.control<string | null>(null, []),
			techRecord_brakes_retarderBrakeTwo: this.fb.control<string | null>(null, []),
		};
	}

	get trlControls() {
		return {
			techRecord_brakes_loadSensingValve: this.fb.control<boolean | null>(null, []),
			techRecord_brakes_antilockBrakingSystem: this.fb.control<boolean | null>(null, []),
		};
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
		return this.parent.get('techRecord_axles') as FormArray;
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

	round(n: number): number {
		return Math.round(n);
	}
}
