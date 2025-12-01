import { FilterByTagsDirective } from '@/src/app/directives/filter-by-tags/filter-by-tags.directive';
import { Modes } from '@/src/app/models/modes.enum';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, input } from '@angular/core';
import {
	type AbstractControl,
	type FormControl,
	FormGroup,
	ReactiveFormsModule,
	type ValidationErrors,
	type ValidatorFn,
} from '@angular/forms';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { ApprovalType as TRLApprovalTypes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { ApprovalType as HGVAndPSVApprovalTypes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalTypeHgvOrPsv.enum.js';
import type { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { GovukFormGroupDateComponent } from '@forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupSelectComponent } from '@forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { ApprovalTypeNumber } from '@forms/custom-sections/type-approval-section/type-approval-section-edit/components/approval-type-number/approval-type-number';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { isEqual } from 'lodash';
import { ReplaySubject } from 'rxjs';

@Component({
	selector: 'app-approval-type',
	templateUrl: './approval-type.component.html',
	styleUrls: ['./approval-type.component.scss'],
	imports: [
		ReactiveFormsModule,
		ApprovalTypeNumber,
		GovukFormGroupInputComponent,
		GovukFormGroupSelectComponent,
		GovukFormGroupDateComponent,
		FilterByTagsDirective,
	],
})
export class ApprovalTypeComponent extends EditBaseComponent implements OnInit, OnDestroy, OnChanges {
	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<V3TechRecordModel>();
	trlApprovalTypes = getOptionsFromEnum(TRLApprovalTypes);
	hgvAndPsvApprovalTypes = getOptionsFromEnum(HGVAndPSVApprovalTypes);

	form: FormGroup = this.fb.group({
		techRecord_approvalType: this.fb.nonNullable.control<string | null>({
			value: null,
			disabled: false,
		}),
		techRecord_approvalTypeNumber: this.fb.control<string | null>({ value: null, disabled: false }, [
			this.requiredWithApprovalType('Approval type number is required with Approval type'),
		]),
		techRecord_ntaNumber: this.fb.control<string | null>({ value: null, disabled: false }, [
			this.commonValidators.maxLength(40, 'National type number'),
		]),
		techRecord_variantNumber: this.fb.control<string | null>({ value: null, disabled: false }, [
			this.commonValidators.maxLength(35, 'Variant number'),
		]),
		techRecord_variantVersionNumber: this.fb.control<string | null>({ value: null, disabled: false }, [
			this.commonValidators.maxLength(35, 'Variant version number'),
		]),
	});

	filters = input<string[]>([]);
	mode = input.required<Modes>();

	ngOnInit(): void {
		this.addControlsBasedOffVehicleType();
		this.init(this.form);

		// Prepopulate form with current tech record
		this.form.patchValue(this.techRecord() as any);
	}

	ngOnChanges(changes: SimpleChanges): void {
		const currentApprovalType = changes['techRecord']?.currentValue?.techRecord_approvalType;
		const previousApprovalType = changes['techRecord']?.previousValue?.techRecord_approvalType;

		if (!isEqual(currentApprovalType, previousApprovalType)) {
			this.form.patchValue({ techRecord_approvalTypeNumber: null });
		}
	}

	requiredWithApprovalType(message: string): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const approvalType = control.parent?.get('techRecord_approvalType')?.value;
			const approvalTypeNumber = control.parent?.get('techRecord_approvalTypeNumber')?.value;

			if (approvalType && !approvalTypeNumber) {
				const error: GlobalError = {
					error: message,
					anchorLink: `techRecord_approvalTypeNumber1-${approvalType}`,
				};
				return { required: error };
			}

			return null;
		};
	}

	private addControlsBasedOffVehicleType() {
		const vehicleControls = this.controlsBasedOffVehicleType;

		for (const [key, control] of Object.entries(vehicleControls ?? {})) {
			this.form.addControl(key, control, { emitEvent: false });
		}
	}

	shouldDisplayFormControl(formControlName: string) {
		return !!this.form.get(formControlName);
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
				this.commonValidators.maxLength(8, 'COIF serial number'),
			]),
			techRecord_coifCertifierName: this.fb.control<string | null>({ value: null, disabled: false }, [
				this.commonValidators.maxLength(20, 'COIF certifier name'),
			]),
			techRecord_coifDate: this.fb.control<string | null>({ value: null, disabled: false }, [
				this.commonValidators.date('COIF certifier date'),
				this.commonValidators.pastDate('COIF certifier date'),
			]),
		};
	}

	get vehicleType(): VehicleTypes {
		return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord());
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
}
