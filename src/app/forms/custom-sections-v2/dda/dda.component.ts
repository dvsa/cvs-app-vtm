import { YES_NO_NULL_OPTIONS } from '@/src/app/models/options.model';
import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { GovukFormGroupInputComponent } from '../../components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '../../components/govuk-form-group-radio/govuk-form-group-radio.component';
import { RadioComponent } from '../../components/govuk-form-group-radio/radio/radio.component';
import { GovukFormGroupTextareaComponent } from '../../components/govuk-form-group-textarea/govuk-form-group-textarea.component';

@Component({
	selector: 'app-dda',
	templateUrl: './dda.component.html',
	styleUrls: ['./dda.component.scss'],
	imports: [
		ReactiveFormsModule,
		GovukFormGroupRadioComponent,
		RadioComponent,
		GovukFormGroupInputComponent,
		GovukFormGroupTextareaComponent,
	],
})
export class DDAComponent extends EditBaseComponent implements OnInit, OnDestroy {
	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly YES_NO_NULL_OPTIONS = YES_NO_NULL_OPTIONS;

	techRecord = input.required<V3TechRecordModel>();

	form = this.fb.group({
		techRecord_dda_certificateIssued: this.fb.control<boolean | null>(null),
		techRecord_dda_wheelchairFittings: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(250, 'Wheelchair fittings must be less than or equal to 250 characters'),
		]),
		techRecord_dda_wheelchairLiftPresent: this.fb.control<boolean | null>(null),
		techRecord_dda_wheelchairLiftInformation: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(250, 'Wheelchair lift information must be less than or equal to 250 characters'),
		]),
		techRecord_dda_wheelchairRampPresent: this.fb.control<boolean | null>(null),
		techRecord_dda_wheelchairRampInformation: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(250, 'Wheelchair ramp information must be less than or equal to 250 characters'),
		]),
		techRecord_dda_minEmergencyExits: this.fb.control<number | null>(null, [
			this.commonValidators.max(99, 'Minimum emergency exits required must be less than or equal to 99'),
		]),
		techRecord_dda_outswing: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(250, 'Outswing must be less than or equal to 250 characters'),
		]),
		techRecord_dda_ddaSchedules: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(250, 'DDA schedules must be less than or equal to 250 characters'),
		]),
		techRecord_dda_seatbeltsFitted: this.fb.control<number | null>(null, [
			this.commonValidators.max(999, 'Number of seatbelts fitted must be less than or equal to 999'),
		]),
		techRecord_dda_ddaNotes: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(1024, 'DDA notes must be less than or equal to 1024 characters'),
		]),
	});

	ngOnInit(): void {
		// Attach all form controls to parent
		this.init(this.form);

		// Prepopulate form with current tech record
		this.form.patchValue(this.techRecord() as any);
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);
	}
}
