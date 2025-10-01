import { TagType } from '@/src/app/components/tag/tag.component';
import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { Component, OnDestroy, OnInit, input } from '@angular/core';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { FieldWarningMessageComponent } from '@forms/components/field-warning-message/field-warning-message.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-dimensions',
	templateUrl: './dimensions.component.html',
	styleUrls: ['./dimensions.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, GovukFormGroupInputComponent, FieldWarningMessageComponent],
})
export class DimensionsComponent extends EditBaseComponent implements OnInit, OnDestroy {
	readonly VehicleTypes = VehicleTypes;
	readonly Widths = FormNodeWidth;
	readonly TagType = TagType;
	readonly TagTypeLabels = TagTypeLabels;

	techRecord = input.required<TechRecordType<'hgv' | 'trl' | 'psv'>>();

	destroy$ = new ReplaySubject<boolean>(1);

	form: FormGroup = this.fb.group({});

	ngOnInit(): void {
		this.addControls(this.controlsBasedOffVehicleType, this.form);

		// Attach all form controls to parent
		this.init(this.form);
	}

	get controlsBasedOffVehicleType() {
		switch (this.techRecord().techRecord_vehicleType) {
			// case VehicleTypes.PSV:
			//   return this.psvControls;
			case VehicleTypes.HGV:
				return this.hgvControls;
			// case VehicleTypes.TRL:
			//   return this.trlControls;
			default:
				return {};
		}
	}

	get hgvControls() {
		return {
			techRecord_dimensions_length: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Length must be less than or equal to 99999mm'),
			]),
			techRecord_dimensions_width: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Width must be less than or equal to 99999mm'),
			]),
			techRecord_frontAxleToRearAxle: this.fb.control<string | null>(null, [
				this.commonValidators.max(99999, 'Front axle to rear axle must be less than or equal to 99999mm'),
			]),
			techRecord_frontVehicleTo5thWheelCouplingMin: this.fb.control<string | null>(null, [
				this.commonValidators.max(
					99999,
					'Minimum value for front of vehicle to fifth wheel must be less than or equal to 99999mm'
				),
			]),
			techRecord_frontVehicleTo5thWheelCouplingMax: this.fb.control<string | null>(null, [
				this.commonValidators.max(
					99999,
					'Maximum value for front of vehicle to fifth wheel must be less than or equal to 99999mm'
				),
			]),
			techRecord_frontAxleTo5thWheelMin: this.fb.control<string | null>(null, [
				this.commonValidators.max(
					99999,
					'Minimum value for front of vehicle to coupling device must be less than or equal to 99999mm'
				),
			]),
			techRecord_frontAxleTo5thWheelMax: this.fb.control<string | null>(null, [
				this.commonValidators.max(
					99999,
					'Maximum value for front of vehicle to coupling device must be less than or equal to 99999mm'
				),
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

	shouldShowLengthWarning(): boolean {
		return (
			(this.techRecord().techRecord_vehicleType === VehicleTypes.HGV ||
				this.techRecord().techRecord_vehicleType === VehicleTypes.TRL) &&
			Number.parseInt(this.form.get('techRecord_dimensions_length')?.value, 10) > 12000
		);
	}

	shouldShowWidthWarning(): boolean {
		return (
			(this.techRecord().techRecord_vehicleType === VehicleTypes.HGV ||
				this.techRecord().techRecord_vehicleType === VehicleTypes.TRL) &&
			Number.parseInt(this.form.get('techRecord_dimensions_width')?.value, 10) > 2600
		);
	}

	get axleSpacings(): FormArray<FormGroup> | undefined {
		return this.parent.get('techRecord_dimensions_axleSpacing') as FormArray;
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}
}
