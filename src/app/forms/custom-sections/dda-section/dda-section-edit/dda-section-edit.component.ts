import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { YES_NO_NULL_OPTIONS } from '@models/options.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { ReplaySubject } from 'rxjs';
@Component({
	selector: 'app-dda-section-edit',
	templateUrl: './dda-section-edit.component.html',
	styleUrls: ['./dda-section-edit.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupRadioComponent,
		GovukFormGroupInputComponent,
		GovukFormGroupTextareaComponent,
	],
})
export class DDASectionEditComponent extends EditBaseComponent implements OnInit, OnDestroy {
	protected readonly VehicleTypes = VehicleTypes;
	protected readonly YES_NO_NULL_OPTIONS = YES_NO_NULL_OPTIONS;

	techRecord = input.required<TechRecordType<'hgv' | 'trl' | 'psv'>>();
	destroy$ = new ReplaySubject<boolean>(1);
	form: FormGroup = this.fb.group({});

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	ngOnInit(): void {
		this.addControls(this.psvControls, this.form);
		// Attach all form controls to parent
		this.init(this.form);
	}

	get psvControls() {
		return {
			techRecord_dda_certificateIssued: this.fb.control<boolean | null>(null),
			techRecord_dda_wheelchairCapacity: this.fb.control<number | null>(null, [
				this.commonValidators.max(99, 'Wheelchair capacity must be less than or equal to 99'),
			]),
			techRecord_dda_wheelchairFittings: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(250, 'Wheelchair fittings must be less than or equal to 250 characters'),
			]),
			techRecord_dda_wheelchairLiftPresent: this.fb.control<boolean | null>(null),
			techRecord_dda_wheelchairLiftInformation: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(
					250,
					'Wheelchair lift information must be less than or equal to 250 characters'
				),
			]),
			techRecord_dda_wheelchairRampPresent: this.fb.control<boolean | null>(null),
			techRecord_dda_wheelchairRampInformation: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(
					250,
					'Wheelchair ramp information must be less than or equal to 250 characters'
				),
			]),
			techRecord_dda_minEmergencyExits: this.fb.control<number | null>(null, [
				this.commonValidators.max(99, 'Minimum emergency exits needed must be less than or equal to 99'),
			]),
			techRecord_dda_outswing: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(250, 'Outswing must be less than or equal to 250 characters'),
			]),
			techRecord_dda_ddaSchedules: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(250, 'DDA schedules must be less than or equal to 250 characters'),
			]),
			techRecord_dda_seatbeltsFitted: this.fb.control<number | null>(null, [
				this.commonValidators.max(999, 'Seatbelts fitted must be less than or equal to 999'),
			]),
			techRecord_dda_ddaNotes: this.fb.control<string | null>(null, [
				this.commonValidators.maxLength(1024, 'DDA notes must be less than or equal to 1024 characters'),
			]),
		};
	}
}
