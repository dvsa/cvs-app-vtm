import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-manufacturer-section-edit',
	templateUrl: './manufacturer-section-edit.component.html',
	styleUrls: ['./manufacturer-section-edit.component.scss'],
	imports: [FormsModule, GovukFormGroupInputComponent, ReactiveFormsModule, GovukFormGroupTextareaComponent],
})
export class ManufacturerSectionEditComponent implements OnInit, OnDestroy {
	fb = inject(FormBuilder);
	store = inject(Store);
	controlContainer = inject(ControlContainer);
	commonValidators = inject(CommonValidatorsService);
	technicalRecordService = inject(TechnicalRecordService);
	techRecord = input.required<V3TechRecordModel>();

	destroy$ = new ReplaySubject<boolean>(1);

	form = this.fb.group({});

	ngOnInit(): void {
		this.addControls();

		// Attach all form controls to parent
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			for (const [key, control] of Object.entries(this.form.controls)) {
				parent.addControl(key, control, { emitEvent: false });
			}
		}
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			for (const key of Object.keys(this.form.controls)) {
				parent.removeControl(key, { emitEvent: false });
			}
		}

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	addControls() {
		const vehicleControls = this.defaultFields;
		for (const [key, control] of Object.entries(vehicleControls)) {
			this.form.addControl(key, control, { emitEvent: false });
		}
	}

	//TODO replace the email validator with the common microservice
	// once the work has been done to export and import that value on the FE
	get defaultFields() {
		return {
			techRecord_manufacturerDetails_name: this.fb.control(null, [
				this.commonValidators.maxLength(150, 'Name must be less than or equal to 150 characters'),
			]),
			techRecord_manufacturerDetails_address1: this.fb.control(null, [
				this.commonValidators.maxLength(60, 'Address line 1 must be less than or equal to 60 characters'),
			]),
			techRecord_manufacturerDetails_address2: this.fb.control(null, [
				this.commonValidators.maxLength(60, 'Address line 2 must be less than or equal to 60 characters'),
			]),
			techRecord_manufacturerDetails_postTown: this.fb.control(null, [
				this.commonValidators.maxLength(60, 'Town or city must be less than or equal to 60 characters'),
			]),
			techRecord_manufacturerDetails_address3: this.fb.control(null, [
				this.commonValidators.maxLength(60, 'County must be less than or equal to 60 characters'),
			]),
			techRecord_manufacturerDetails_postCode: this.fb.control(null, [
				this.commonValidators.maxLength(12, 'Postcode must be less than or equal to 12 characters'),
			]),
			techRecord_manufacturerDetails_telephoneNumber: this.fb.control(null, [
				this.commonValidators.maxLength(25, 'Telephone number must be less than or equal to 25 characters'),
			]),
			techRecord_manufacturerDetails_emailAddress: this.fb.control(null, [
				this.commonValidators.maxLength(255, 'Email address must be less than or equal to 255 characters'),
				this.commonValidators.pattern(
					"^[\\w\\-\\.\\+']+@([\\w-]+\\.)+[\\w-]{2,}$",
					'Email address Enter an email address in the correct format, like name@example.com'
				),
			]),
			techRecord_manufacturerDetails_faxNumber: this.fb.control(null, [
				this.commonValidators.maxLength(25, 'Fax number must be less than or equal to 25 characters'),
			]),
			techRecord_manufacturerDetails_manufacturerNotes: this.fb.control(null, [
				this.commonValidators.maxLength(1024, 'Manufacturer notes must be less than or equal to 1024 characters'),
			]),
		};
	}

	getVehicleType(): VehicleTypes {
		return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord());
	}

	shouldDisplayFormControl(formControlName: string) {
		return !!this.form.get(formControlName);
	}

	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly TagTypeLabels = TagTypeLabels;
	protected readonly TagType = TagType;
	protected readonly VehicleTypes = VehicleTypes;
}
