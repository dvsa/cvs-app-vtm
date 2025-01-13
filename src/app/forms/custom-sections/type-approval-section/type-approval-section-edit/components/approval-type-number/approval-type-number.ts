import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, Input, inject, signal } from '@angular/core';
import { AbstractControl, ControlContainer, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { SharedModule } from '@shared/shared.module';

@Component({
	selector: 'approval-type-number-input',
	templateUrl: 'approval-type-number.html',
	standalone: true,
	imports: [FormsModule, NgSwitchCase, SharedModule, NgSwitch, NgSwitchDefault, ReactiveFormsModule],
})
export class ApprovalTypeNumber {
	@Input({ required: true })
	width!: FormNodeWidth;

	@Input({ alias: 'label', required: true })
	controlLabel = '';

	@Input({ alias: 'formControlName', required: true })
	controlName = '';

	@Input()
	disabled = false;

	@Input({ required: true })
	approvalTypeControlName!: string;

	private approvalTypeNumber_1 = signal<string | undefined>(undefined);

	public errors?: {
		error: boolean;
		errors?: {
			error: boolean;
			reason: string;
			index: number;
		}[];
	};

	private readonly controlContainer = inject(ControlContainer);

	get id() {
		return this.controlName;
	}

	get approvalType() {
		return this.controlContainer.control?.get(this.approvalTypeControlName)?.value;
	}

	get control() {
		return this.controlContainer.control?.get(this.controlName) as AbstractControl;
	}

	protected readonly FormNodeWidth = FormNodeWidth;

	onTechRecord_approvalTypeNumber1_Change(event: string | undefined) {
		this.approvalTypeNumber_1.set(event);
	}

	validate() {
		const setErrors = () => {
			this.errors = {
				error: true,
				errors: [
					{
						error: true,
						reason: 'Approval type number is required with Approval type',
						index: 0,
					},
				],
			};
		};

		const oneRequired = () => !this.approvalTypeNumber_1() && this.approvalType;
		// const twoRequired = () => oneRequired() || !this.approvalTypeNumber2;
		// const threeRequired = () => twoRequired() || !this.approvalTypeNumber3;
		// const fourRequired = () => threeRequired() || !this.approvalTypeNumber4;

		const twoRequired = () => oneRequired() || false;
		const threeRequired = () => twoRequired() || false;
		const fourRequired = () => threeRequired() || false;

		switch (this.approvalType) {
			case ApprovalType.NTA:
			case ApprovalType.IVA:
			case ApprovalType.IVA_DVSA_NI:
				console.log('oneRequired', oneRequired());

				if (oneRequired()) {
					setErrors();
				}
				break;

			case ApprovalType.GB_WVTA:
			case ApprovalType.EU_WVTA_PRE_23:
			case ApprovalType.EU_WVTA_23_ON:
			case ApprovalType.PROV_GB_WVTA:
			case ApprovalType.QNIG:
			case ApprovalType.ECTA:
			case ApprovalType.ECSSTA:
			case ApprovalType.UKNI_WVTA:
				if (fourRequired()) {
					setErrors();
				}
				break;

			case ApprovalType.IVA_VCA:
			case ApprovalType.SMALL_SERIES_NKSXX:
				if (fourRequired()) {
					setErrors();
				}
				break;

			case ApprovalType.NSSTA:
			case ApprovalType.SMALL_SERIES_NKS:
				if (twoRequired()) {
					setErrors();
				}
				break;

			default:
				break;
		}
	}

	processApprovalTypeNumber(
		approvalTypeNumber1: string | undefined,
		approvalTypeNumber2: string | undefined,
		approvalTypeNumber3: string | undefined,
		approvalTypeNumber4: string | undefined
	) {
		switch (this.approvalType) {
			case ApprovalType.NTA:
				return approvalTypeNumber1 || null;

			case ApprovalType.ECTA:
				return approvalTypeNumber1 && approvalTypeNumber2 && approvalTypeNumber3 && approvalTypeNumber4
					? `e${approvalTypeNumber1}*${approvalTypeNumber2}/${approvalTypeNumber3}*${approvalTypeNumber4}`
					: null;

			case ApprovalType.IVA:
				return approvalTypeNumber1 || null;

			case ApprovalType.NSSTA:
				return approvalTypeNumber1 && approvalTypeNumber2 ? `e${approvalTypeNumber1}*NKS*${approvalTypeNumber2}` : null;

			case ApprovalType.ECSSTA:
				return approvalTypeNumber1 && approvalTypeNumber2 && approvalTypeNumber3 && approvalTypeNumber4
					? `e${approvalTypeNumber1}*KS${approvalTypeNumber2}/${approvalTypeNumber3}*${approvalTypeNumber4}`
					: null;

			case ApprovalType.GB_WVTA:
				return approvalTypeNumber1 && approvalTypeNumber2 && approvalTypeNumber3 && approvalTypeNumber4
					? `${approvalTypeNumber1}*${approvalTypeNumber2}/${approvalTypeNumber3}*${approvalTypeNumber4}`
					: null;

			case ApprovalType.UKNI_WVTA:
				return approvalTypeNumber1 && approvalTypeNumber2 && approvalTypeNumber3 && approvalTypeNumber4
					? `${approvalTypeNumber1}11*${approvalTypeNumber2}/${approvalTypeNumber3}*${approvalTypeNumber4}`
					: null;

			case ApprovalType.EU_WVTA_PRE_23:
				return approvalTypeNumber1 && approvalTypeNumber2 && approvalTypeNumber3 && approvalTypeNumber4
					? `e${approvalTypeNumber1}*${approvalTypeNumber2}/${approvalTypeNumber3}*${approvalTypeNumber4}`
					: null;

			case ApprovalType.EU_WVTA_23_ON:
				return approvalTypeNumber1 && approvalTypeNumber2 && approvalTypeNumber3 && approvalTypeNumber4
					? `e${approvalTypeNumber1}*${approvalTypeNumber2}/${approvalTypeNumber3}*${approvalTypeNumber4}`
					: null;

			case ApprovalType.QNIG:
				return approvalTypeNumber1 && approvalTypeNumber2 && approvalTypeNumber3 && approvalTypeNumber4
					? `e${approvalTypeNumber1}*${approvalTypeNumber2}/${approvalTypeNumber3}*${approvalTypeNumber4}`
					: null;

			case ApprovalType.PROV_GB_WVTA:
				return approvalTypeNumber1 && approvalTypeNumber2 && approvalTypeNumber3 && approvalTypeNumber4
					? `${approvalTypeNumber1}*${approvalTypeNumber2}/${approvalTypeNumber3}*${approvalTypeNumber4}`
					: null;

			case ApprovalType.SMALL_SERIES_NKSXX:
				return approvalTypeNumber1 && approvalTypeNumber2 && approvalTypeNumber3
					? `${approvalTypeNumber1}11*NKS${approvalTypeNumber2}/${approvalTypeNumber3}*${approvalTypeNumber4}`
					: null;

			case ApprovalType.SMALL_SERIES_NKS:
				return approvalTypeNumber1 && approvalTypeNumber2
					? `${approvalTypeNumber1}11*NKS*${approvalTypeNumber2}`
					: null;

			case ApprovalType.IVA_VCA:
				return approvalTypeNumber1 && approvalTypeNumber2 && approvalTypeNumber3
					? `n11*NIV${approvalTypeNumber1}/${approvalTypeNumber2}*${approvalTypeNumber3}`
					: null;

			case ApprovalType.IVA_DVSA_NI:
				return approvalTypeNumber1 || null;
			default:
				return 'Unknown approval type';
		}
	}
}
