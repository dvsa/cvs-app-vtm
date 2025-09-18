import { Component, type OnDestroy, type OnInit, inject, input } from '@angular/core';
import {
	type AbstractControl,
	ControlContainer,
	FormBuilder,
	type FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	type ValidationErrors,
	type ValidatorFn,
} from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { ApprovalType as TRLApprovalTypes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { ApprovalType as HGVAndPSVApprovalTypes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalTypeHgvOrPsv.enum.js';
import type { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { type V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNodeWidth, TagTypeLabels } from '@services/dynamic-forms/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { ReplaySubject } from 'rxjs';
import { GovukFormGroupDateComponent } from '../../../components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupInputComponent } from '../../../components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupSelectComponent } from '../../../components/govuk-form-group-select/govuk-form-group-select.component';
import { ApprovalTypeNumber } from './components/approval-type-number/approval-type-number';

type TypeApprovalSectionForm = Partial<Record<keyof TechRecordType<'hgv' | 'psv' | 'trl'>, FormControl>>;

@Component({
	selector: 'app-type-approval-section-edit',
	templateUrl: './type-approval-section-edit.component.html',
	styleUrls: ['./type-approval-section-edit.component.scss'],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		GovukFormGroupSelectComponent,
		ApprovalTypeNumber,
		GovukFormGroupInputComponent,
		GovukFormGroupDateComponent,
	],
})
export class TypeApprovalSectionEditComponent implements OnInit, OnDestroy {
	private readonly fb = inject(FormBuilder);
	private readonly controlContainer = inject(ControlContainer);
	private readonly commonValidators = inject(CommonValidatorsService);
	private readonly technicalRecordService = inject(TechnicalRecordService);

	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly VehicleTypes = VehicleTypes;
	protected readonly TagType = TagType;
	protected readonly TagTypeLabels = TagTypeLabels;

	trlApprovalTypes = getOptionsFromEnum(TRLApprovalTypes);
	hgvAndPsvApprovalTypes = getOptionsFromEnum(HGVAndPSVApprovalTypes);

	techRecord = input.required<V3TechRecordModel>();

	destroy$ = new ReplaySubject<boolean>(1);

	form = this.fb.group<TypeApprovalSectionForm>({
		techRecord_approvalType: this.fb.nonNullable.control<string | null>({
			value: null,
			disabled: false,
		}),
		techRecord_approvalTypeNumber: this.fb.control<string | null>({ value: null, disabled: false }, [
			this.requiredWithApprovalType('Approval type number is required with Approval type'),
		]),
		techRecord_ntaNumber: this.fb.control<string | null>({ value: null, disabled: false }, [
			this.commonValidators.maxLength(40, 'National type number must be less than or equal to 40 characters'),
		]),
		techRecord_variantNumber: this.fb.control<string | null>({ value: null, disabled: false }, [
			this.commonValidators.maxLength(35, 'Variant number must be less than or equal to 35 characters'),
		]),
		techRecord_variantVersionNumber: this.fb.control<string | null>({ value: null, disabled: false }, [
			this.commonValidators.maxLength(35, 'Variant version number must be less than or equal to 35 characters'),
		]),
	});

	ngOnInit(): void {
		// Set validator in ngOnInit, as this required vehicle type from inputs
		this.form.controls.techRecord_approvalType?.setValidators([
			this.commonValidators.isOneOf(
				this.vehicleType === VehicleTypes.TRL ? TRLApprovalTypes : HGVAndPSVApprovalTypes,
				'Approval type is required'
			),
		]);

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

	requiredWithApprovalType(message: string): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const approvalType = control.parent?.get('techRecord_approvalType')?.value;
			const approvalTypeNumber = control.value;

			if (approvalType && !approvalTypeNumber) {
				return { required: message };
			}

			return null;
		};
	}

	get vehicleType(): VehicleTypes {
		return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord());
	}

	get controlsBasedOffVehicleType() {
		if (this.vehicleType === VehicleTypes.PSV) {
			return this.psvOnlyFields;
		}
		return null;
	}

	private get psvOnlyFields(): Partial<Record<keyof TechRecordType<'psv'>, FormControl>> {
		return {
			techRecord_coifSerialNumber: this.fb.control<string | null>({ value: null, disabled: false }, [
				this.commonValidators.maxLength(8, 'COIF Serial number must be less than or equal to 8 characters'),
			]),
			techRecord_coifCertifierName: this.fb.control<string | null>({ value: null, disabled: false }, [
				this.commonValidators.maxLength(20, 'COIF Certifier name must be less than or equal to 20 characters'),
			]),
			techRecord_coifDate: this.fb.control<string | null>({ value: null, disabled: false }, [
				this.commonValidators.date('COIF Certifier date'),
				this.commonValidators.pastDate('COIF Certifier date must be in the past'),
			]),
		};
	}
}
