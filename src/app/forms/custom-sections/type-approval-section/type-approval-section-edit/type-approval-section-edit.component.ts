import { FormNodeWidth, TagTypeLabels } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import {
	AbstractControl,
	ControlContainer,
	FormBuilder,
	FormControl,
	FormGroup,
	ValidationErrors,
	ValidatorFn,
} from '@angular/forms';
import { TagType } from '@components/tag/tag.component';
import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { ReplaySubject } from 'rxjs';

type TypeApprovalSectionForm = Partial<Record<keyof TechRecordType<'hgv' | 'psv' | 'trl'>, FormControl>>;

@Component({
	selector: 'app-type-approval-section-edit',
	templateUrl: './type-approval-section-edit.component.html',
	styleUrls: ['./type-approval-section-edit.component.scss'],
})
export class TypeApprovalSectionEditComponent implements OnInit, OnDestroy {
	private readonly fb = inject(FormBuilder);
	private readonly controlContainer = inject(ControlContainer);
	private readonly commonValidators = inject(CommonValidatorsService);
	private readonly technicalRecordService = inject(TechnicalRecordService);

	techRecord = input.required<V3TechRecordModel>();

	destroy$ = new ReplaySubject<boolean>(1);

	form = this.fb.group<TypeApprovalSectionForm>({
		techRecord_approvalType: this.fb.control<ApprovalType | null>({ value: null, disabled: false }, [
			this.commonValidators.isOneOf(ApprovalType, 'Approval type is required'),
		]),
		techRecord_approvalTypeNumber: this.fb.control<string | null>({ value: null, disabled: false }, [
			this.handleApprovalTypeChange(),
		]),
		techRecord_ntaNumber: this.fb.control<string | null>({ value: null, disabled: false }, [
			this.commonValidators.maxLength(40, 'National type number must be less than or equal to 40 characters'),
		]),
		techRecord_variantNumber: this.fb.control<string | null>({ value: null, disabled: false }, [
			this.commonValidators.maxLength(25, 'Variant number must be less than or equal to 25 characters'),
		]),
		techRecord_variantVersionNumber: this.fb.control<string | null>({ value: null, disabled: false }, [
			this.commonValidators.maxLength(35, 'Variant version number must be less than or equal to 35 characters'),
		]),
	});

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
			this.form.addControl(key, control, { emitEvent: false });
		}
	}

	shouldDisplayFormControl(formControlName: string) {
		return !!this.form.get(formControlName);
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

	private handleApprovalTypeChange(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			if (control.dirty) {
				if (this.showApprovalTypeNumber) {
					return { required: 'Approval type number is required' };
				}
			}

			return null;
		};
	}

	get showApprovalTypeNumber(): boolean {
		return this.approvalTypes.includes(this.form.get('techRecord_approvalType')?.value);
	}

	private get approvalTypes() {
		// We could do a base and then merge the extra from PSV, but they seem to be in slightly different order
		// so not sure if that's intentional
		if (this.vehicleType === VehicleTypes.PSV) {
			return [
				'NTA',
				'ECTA',
				'ECSSTA',
				'IVA',
				'NSSTA',
				'GB WVTA',
				'UKNI WVTA',
				'EU WVTA Pre 23',
				'EU WVTA 23 on',
				'QNIG',
				'Prov.GB WVTA',
				'Small series NKSXX',
				'Small series NKS',
				'IVA - VCA',
				'IVA - DVSA/NI',
			];
		}

		return [
			'NTA',
			'ECTA',
			'IVA',
			'NSSTA',
			'ECSSTA',
			'GB WVTA',
			'Prov.GB WVTA',
			'Small series NKSXX',
			'Small series NKS',
			'IVA - VCA',
			'IVA - DVSA/NI',
		];
	}

	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly VehicleTypes = VehicleTypes;
	protected readonly ApprovalTypes = getOptionsFromEnum(ApprovalType);
	protected readonly TagType = TagType;
	protected readonly TagTypeLabels = TagTypeLabels;
}
