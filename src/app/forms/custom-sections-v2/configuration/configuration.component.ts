import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FuelPropulsionSystem } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { GovukFormGroupSelectComponent } from '@forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { FUEL_PROPULSION_SYSTEM_OPTIONS, SUSPENSION_TYRE_OPTIONS, YES_NO_OPTIONS } from '@models/options.model';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-configuration',
	templateUrl: './configuration.component.html',
	styleUrls: ['./configuration.component.scss'],

	imports: [
		ReactiveFormsModule,
		GovukFormGroupRadioComponent,
		GovukFormGroupSelectComponent,
		GovukFormGroupInputComponent,
	],
})
export class ConfigurationComponent extends EditBaseComponent implements OnInit, OnDestroy {
	protected readonly VehicleTypes = VehicleTypes;
	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly YES_NO_OPTIONS = YES_NO_OPTIONS;
	protected readonly FUEL_PROPULSION_SYSTEM_OPTIONS = FUEL_PROPULSION_SYSTEM_OPTIONS;
	protected readonly SUSPENSION_TYRE_OPTIONS = SUSPENSION_TYRE_OPTIONS;

	form: FormGroup = this.fb.group({});
	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<V3TechRecordModel>();

	get controlsBasedOffVehicleType() {
		switch (this.getVehicleType()) {
			case VehicleTypes.HGV:
				return this.hgvFields;
			case VehicleTypes.TRL:
				return this.trlFields;
			case VehicleTypes.PSV:
				return this.psvFields;
			default:
				return {};
		}
	}

	getVehicleType(): VehicleTypes {
		return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord());
	}

	get hgvFields(): Partial<Record<keyof TechRecordType<'hgv'>, FormControl>> {
		return {
			techRecord_offRoad: this.fb.control<boolean | null>(null),
			techRecord_departmentalVehicleMarker: this.fb.control<boolean | null>(null),
			techRecord_alterationMarker: this.fb.control<boolean | null>(null),
			techRecord_fuelPropulsionSystem: this.fb.control<FuelPropulsionSystem | null>(null),
			techRecord_roadFriendly: this.fb.control<boolean | null>(null),
		};
	}

	get trlFields(): Partial<Record<keyof TechRecordType<'trl'>, FormControl>> {
		return {
			techRecord_departmentalVehicleMarker: this.fb.control<boolean | null>(null),
			techRecord_alterationMarker: this.fb.control<boolean | null>(null),
			techRecord_roadFriendly: this.fb.control<boolean | null>(null),
			techRecord_suspensionType: this.fb.control<string | null>(null),
		};
	}

	get psvFields(): Partial<Record<keyof TechRecordType<'psv'>, FormControl>> {
		return {
			techRecord_departmentalVehicleMarker: this.fb.control<boolean | null>(null),
			techRecord_alterationMarker: this.fb.control<boolean | null>(null),
			techRecord_fuelPropulsionSystem: this.fb.control<FuelPropulsionSystem | null>(null),
			techRecord_speedRestriction: this.fb.control<number | null>(null, [
				this.commonValidators.max(99, 'Speed restriction must be less than or equal to 99mph'),
			]),
		};
	}

	shouldDisplayFormControl(formControlName: string) {
		return !!this.form.get(formControlName);
	}

	ngOnInit(): void {
		this.addControls(this.controlsBasedOffVehicleType, this.form);
		// Attach all form controls to parent
		this.init(this.form);

		// Prepopulate form with current tech record
		this.form.patchValue(this.techRecord() as any);
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}
}
