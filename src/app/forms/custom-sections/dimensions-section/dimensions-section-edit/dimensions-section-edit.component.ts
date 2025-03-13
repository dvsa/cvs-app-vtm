import { TagType } from '@/src/app/components/tag/tag.component';
import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { FormNodeWidth, TagTypeLabels } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { addAxle, removeAxle } from '@/src/app/store/technical-records';
import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ReplaySubject, takeUntil, withLatestFrom } from 'rxjs';

@Component({
	selector: 'app-dimensions-section-edit',
	templateUrl: './dimensions-section-edit.component.html',
	styleUrls: ['./dimensions-section-edit.component.scss'],
})
export class DimensionsSectionEditComponent implements OnInit, OnDestroy {
	readonly VehicleTypes = VehicleTypes;
	readonly Widths = FormNodeWidth;
	readonly TagType = TagType;
	readonly TagTypeLabels = TagTypeLabels;

	fb = inject(FormBuilder);
	store = inject(Store);
	actions = inject(Actions);
	controlContainer = inject(ControlContainer);
	commonValidators = inject(CommonValidatorsService);
	technicalRecordService = inject(TechnicalRecordService);
	techRecord = input.required<TechRecordType<'hgv' | 'trl' | 'psv'>>();

	destroy$ = new ReplaySubject<boolean>(1);

	form: FormGroup = this.fb.group({});

	get axleSpacings(): FormArray<FormGroup> | undefined {
		return this.form.get('techRecord_dimensions_axleSpacing') as FormArray;
	}

	ngOnInit(): void {
		this.addControlsBasedOffVehicleType();
		this.prepopulateAxleSpacings();
		this.checkAxleAdded();
		this.checkAxleRemoved();

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

	prepopulateAxleSpacings() {
		const techRecord = this.techRecord();
		if (
			techRecord.techRecord_vehicleType === VehicleTypes.HGV ||
			techRecord.techRecord_vehicleType === VehicleTypes.TRL
		) {
			techRecord.techRecord_dimensions_axleSpacing?.forEach(() => {
				const form = this.getAxleSpacingForm();
				this.axleSpacings?.push(form, { emitEvent: false });
			});
		}
	}

	checkAxleAdded() {
		this.actions
			.pipe(ofType(addAxle), takeUntil(this.destroy$), withLatestFrom(this.technicalRecordService.techRecord$))
			.subscribe(([_, techRecord]) => {
				if (techRecord && (techRecord.techRecord_noOfAxles || 0) >= 2) {
					const axleSpacings = (techRecord as TechRecordType<'hgv' | 'trl'>).techRecord_dimensions_axleSpacing || [];
					this.axleSpacings?.push(this.getAxleSpacingForm(), { emitEvent: false });
					this.axleSpacings?.patchValue(axleSpacings, { emitEvent: false });
				}
			});
	}

	checkAxleRemoved() {
		this.actions
			.pipe(ofType(removeAxle), takeUntil(this.destroy$), withLatestFrom(this.technicalRecordService.techRecord$))
			.subscribe(([_, techRecord]) => {
				if (techRecord) {
					const axleSpacings = (techRecord as TechRecordType<'hgv' | 'trl'>).techRecord_dimensions_axleSpacing || [];
					this.axleSpacings?.removeAt(0, { emitEvent: false });
					this.axleSpacings?.patchValue(axleSpacings, { emitEvent: false });
				}
			});
	}

	addControlsBasedOffVehicleType() {
		const vehicleControls = this.controlsBasedOffVehicleType;
		for (const [key, control] of Object.entries(vehicleControls)) {
			this.form.addControl(key, control, { emitEvent: false });
		}
	}

	getAxleSpacingForm() {
		return this.fb.group({
			value: this.fb.control<number | null>(null, [
				this.commonValidators.max(99999, 'Axle spacing must be less than 99999 mm'),
			]),
		});
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
			techRecord_dimensions_axleSpacing: this.fb.array([]),
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
			techRecord_dimensions_axleSpacing: this.fb.array([]),
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
}
