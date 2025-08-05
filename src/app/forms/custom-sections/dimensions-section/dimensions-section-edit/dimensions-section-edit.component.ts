import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions } from '@ngrx/effects';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { ReplaySubject } from 'rxjs';

import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { FieldWarningMessageComponent } from '../../../components/field-warning-message/field-warning-message.component';
import { GovukFormGroupInputComponent } from '../../../components/govuk-form-group-input/govuk-form-group-input.component';

@Component({
	selector: 'app-dimensions-section-edit',
	templateUrl: './dimensions-section-edit.component.html',
	styleUrls: ['./dimensions-section-edit.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupInputComponent, FieldWarningMessageComponent],
})
export class DimensionsSectionEditComponent extends EditBaseComponent implements OnInit, OnDestroy {
	readonly VehicleTypes = VehicleTypes;
	readonly Widths = FormNodeWidth;
	readonly TagType = TagType;
	readonly TagTypeLabels = TagTypeLabels;

	actions = inject(Actions);
	techRecord = input.required<TechRecordType<'hgv' | 'trl' | 'psv'>>();

	destroy$ = new ReplaySubject<boolean>(1);

	form: FormGroup = this.fb.group({});

	get axleSpacings(): FormArray<FormGroup> | undefined {
		return this.parent.get('techRecord_dimensions_axleSpacing') as FormArray;
	}

	ngOnInit(): void {
		this.addControls(this.controlsBasedOffVehicleType, this.form);

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

	get controlsBasedOffVehicleType() {
		switch (this.techRecord().techRecord_vehicleType) {
			case VehicleTypes.PSV:
				return this.psvControls;
			case VehicleTypes.HGV:
				return this.hgvControls;
			case VehicleTypes.TRL:
				return this.trlControls;
			default:
				return {};
		}
	}

	get hgvControls() {
		return {
			techRecord_dimensions_length: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Length must be less than or equal to 99999'),
			]),
			techRecord_dimensions_width: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Width must be less than or equal to 99999'),
			]),
			techRecord_frontAxleToRearAxle: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Front axle to rear axle must be less than or equal to 99999'),
			]),
			techRecord_frontVehicleTo5thWheelCouplingMin: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Minimum must be less than or equal to 99999'),
			]),
			techRecord_frontVehicleTo5thWheelCouplingMax: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Maximum must be less than or equal to 99999'),
			]),
			techRecord_frontAxleTo5thWheelMin: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Minimum must be less than or equal to 99999'),
			]),
			techRecord_frontAxleTo5thWheelMax: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Maximum must be less than or equal to 99999'),
			]),
		};
	}

	get psvControls() {
		return {
			techRecord_dimensions_height: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Height must be less than or equal to 99999'),
			]),
			techRecord_dimensions_length: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Length must be less than or equal to 99999'),
			]),
			techRecord_dimensions_width: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Width must be less than or equal to 99999'),
			]),
			techRecord_frontAxleToRearAxle: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Front axle to rear axle must be less than or equal to 99999'),
			]),
		};
	}

	get trlControls() {
		return {
			techRecord_dimensions_length: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Length must be less than or equal to 99999'),
			]),
			techRecord_dimensions_width: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Width must be less than or equal to 99999'),
			]),
			techRecord_frontAxleToRearAxle: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Front axle to rear axle must be less than or equal to 99999'),
			]),
			techRecord_rearAxleToRearTrl: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Rear axle to rear of trailer must be less than or equal to 99999'),
			]),
			techRecord_centreOfRearmostAxleToRearOfTrl: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Centre of rear axle to rear of trailer must be less than or equal to 99999'),
			]),
			techRecord_couplingCenterToRearAxleMin: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Minimum must be less than or equal to 99999'),
			]),
			techRecord_couplingCenterToRearAxleMax: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Maximum must be less than or equal to 99999'),
			]),
			techRecord_couplingCenterToRearTrlMin: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Minimum must be less than or equal to 99999'),
			]),
			techRecord_couplingCenterToRearTrlMax: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Maximum must be less than or equal to 99999'),
			]),
		};
	}

	get couplingCenterToRearTrlMinWarning() {
		return Number.parseInt(this.form.get('techRecord_couplingCenterToRearTrlMin')?.value, 10) > 12000
			? 'The coupling centre to rear of trailer minimum field value is greater than 12,000mm. Check your input before proceeding'
			: '';
	}

	get couplingCenterToRearTrlMaxWarning() {
		return Number.parseInt(this.form.get('techRecord_couplingCenterToRearTrlMax')?.value, 10) > 12000
			? 'The coupling centre to rear of trailer maximum field value is greater than 12,000mm. Check your input before proceeding'
			: '';
	}

	get lengthWarning() {
		return Number.parseInt(this.form.get('techRecord_dimensions_length')?.value, 10) > 12000
			? 'This length dimension field value is greater than 12,000mm. Check your input before proceeding'
			: '';
	}

	get widthWarning() {
		return Number.parseInt(this.form.get('techRecord_dimensions_width')?.value, 10) > 2600
			? 'This width dimension field value is greater than 2,600mm. Check your input before proceeding'
			: '';
	}
}
