import { FormNodeWidth, TagTypeLabels } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { ControlContainer, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-trl-purchasers-section-edit',
	templateUrl: './trl-purchasers-section-edit.component.html',
	styleUrls: ['./trl-purchasers-section-edit.component.scss'],
})
export class TRLPurchasersSectionEditComponent implements OnInit, OnDestroy {
	private readonly fb = inject(FormBuilder);
	private readonly controlContainer = inject(ControlContainer);
	private readonly technicalRecordService = inject(TechnicalRecordService);
	private readonly commonValidators = inject(CommonValidatorsService);

	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly VehicleTypes = VehicleTypes;
	protected readonly TagType = TagType;
	protected readonly TagTypeLabels = TagTypeLabels;

	techRecord = input.required<V3TechRecordModel>();

	destroy$ = new ReplaySubject<boolean>(1);

	form = this.fb.group({});

	ngOnInit(): void {
		this.addControlsBasedOffVehicleType();

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

	private addControlsBasedOffVehicleType() {
		const vehicleControls = this.controlsBasedOffVehicleType;

		for (const [key, control] of Object.entries(vehicleControls ?? {})) {
			this.form?.addControl(key, control, { emitEvent: false });
		}
	}

	shouldDisplayFormControl(formControlName: string) {
		return !!this.form.get(formControlName);
	}

	get vehicleType(): VehicleTypes {
		return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord());
	}

	get controlsBasedOffVehicleType() {
		if (this.vehicleType === VehicleTypes.TRL) {
			return this.trlOnlyFields;
		}
		return null;
	}

	private get trlOnlyFields(): Partial<Record<keyof TechRecordType<'trl'>, FormControl>> {
		return {
			techRecord_purchaserDetails_name: this.fb.control(null, [
				this.commonValidators.maxLength(150, 'Name or company must be less than or equal to 150 characters'),
			]),
			techRecord_purchaserDetails_address1: this.fb.control(null, [
				this.commonValidators.maxLength(60, 'Address line 1 must be less than or equal to 60 characters'),
			]),
			techRecord_purchaserDetails_address2: this.fb.control(null, [
				this.commonValidators.maxLength(60, 'Address line 2 must be less than or equal to 60 characters'),
			]),
			techRecord_purchaserDetails_postTown: this.fb.control(null, [
				this.commonValidators.maxLength(60, 'Town or city must be less than or equal to 60 characters'),
			]),
			techRecord_purchaserDetails_address3: this.fb.control(null, [
				this.commonValidators.maxLength(60, 'County must be less than or equal to 60 characters'),
			]),
			techRecord_purchaserDetails_postCode: this.fb.control(null, [
				this.commonValidators.maxLength(12, 'Postcode must be less than or equal to 12 characters'),
			]),
			techRecord_purchaserDetails_telephoneNumber: this.fb.control(null, [
				this.commonValidators.maxLength(25, 'Telephone number must be less than or equal to 25 characters'),
			]),
			techRecord_purchaserDetails_emailAddress: this.fb.control(null, [
				this.commonValidators.maxLength(255, 'Email address must be less than or equal to 255 characters'),
				this.commonValidators.pattern(
					"^[\\w\\-\\.\\+']+@([\\w-]+\\.)+[\\w-]{2,}$",
					'Email address Enter an email address in the correct format, like name@example.com'
				),
			]),
			techRecord_purchaserDetails_faxNumber: this.fb.control(null, [
				this.commonValidators.maxLength(25, 'Fax Number must be less than or equal to 25 characters'),
			]),
			techRecord_purchaserDetails_purchaserNotes: this.fb.control(null, [
				this.commonValidators.maxLength(1024, 'Purchaser Notes must be less than or equal to 1024 characters'),
			]),
		};
	}
}
