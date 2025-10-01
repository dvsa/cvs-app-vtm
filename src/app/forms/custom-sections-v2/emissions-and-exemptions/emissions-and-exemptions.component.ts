import { EMISSION_STANDARD_OPTIONS, EXEMPT_OR_NOT_OPTIONS, YES_NO_OPTIONS } from '@/src/app/models/options.model';
import { FormNodeWidth } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { ReplaySubject } from 'rxjs';
import { GovukFormGroupInputComponent } from '../../components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '../../components/govuk-form-group-radio/govuk-form-group-radio.component';

@Component({
	selector: 'app-emissions-and-exemptions',
	templateUrl: './emissions-and-exemptions.component.html',
	styleUrls: ['./emissions-and-exemptions.component.scss'],
	imports: [ReactiveFormsModule, GovukFormGroupRadioComponent, GovukFormGroupInputComponent],
})
export class EmissionsAndExemptionsComponent extends EditBaseComponent implements OnInit, OnDestroy {
	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<V3TechRecordModel>();

	// TODO properly type this at some point
	form = this.fb.group<any>({});

	ngOnInit(): void {
		this.addControls(this.controlsBasedOffVehicleType, this.form);

		// Attach all form controls to parent
		this.init(this.form);
	}

	get controlsBasedOffVehicleType() {
		switch (this.getVehicleType()) {
			case VehicleTypes.HGV:
				return this.hgvFields;
			case VehicleTypes.PSV:
				return this.psvFields;
			default:
				return {};
		}
	}

	get hgvFields() {
		return {
			techRecord_drawbarCouplingFitted: this.fb.control<boolean | null>(null),
			techRecord_euroStandard: this.fb.control<string | null>(null),
			techRecord_emissionsLimit: this.fb.control<number | null>(null, [
				this.commonValidators.max(99, 'Emission limit (smoke absorption coefficient) must be less than or equal to 99'),
				this.commonValidators.pattern(
					/^\d*(\.\d{0,5})?$/,
					'Emission limit (smoke absorption coefficient) max 5 decimal places'
				),
			]),
			techRecord_speedLimiterMrk: this.fb.control<boolean | null>(null),
			techRecord_tachoExemptMrk: this.fb.control<boolean | null>(null),
		};
	}

	get psvFields() {
		return {
			techRecord_euroStandard: this.fb.control<string | null>(null),
			techRecord_emissionsLimit: this.fb.control<number | null>(null, [
				this.commonValidators.max(99, 'Emission limit (smoke absorption coefficient) must be less than or equal to 99'),
				this.commonValidators.pattern(
					/^\d*(\.\d{0,5})?$/,
					'Emission limit (smoke absorption coefficient) max 5 decimal places'
				),
			]),
			techRecord_speedLimiterMrk: this.fb.control<boolean | null>(null),
			techRecord_tachoExemptMrk: this.fb.control<boolean | null>(null),
		};
	}

	getVehicleType(): VehicleTypes {
		return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord());
	}

	shouldDisplayFormControl(formControlName: string) {
		return !!this.form.get(formControlName);
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	protected readonly VehicleTypes = VehicleTypes;
	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly YES_NO_OPTIONS = YES_NO_OPTIONS;
	protected readonly EXEMPT_OR_NOT_OPTIONS = EXEMPT_OR_NOT_OPTIONS;
	protected readonly EMISSION_STANDARD_OPTIONS = EMISSION_STANDARD_OPTIONS;
}
