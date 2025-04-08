import { ApprovalTypeFocusNextDirective } from '@/src/app/directives/approval-type-focus-next/approval-type-focus-next.directive';
import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import {
	APPROVAL_NUMBER_TYPE_REGEX,
	APPROVAL_TYPE_NUMBER_CHARACTER_LIMIT,
	APPROVAL_TYPE_NUMBER_CHARACTER_LIMIT_GENERIC,
	APPROVAL_TYPE_NUMBER_REGEX_GENERIC_PARTIAL_MATCH,
	APPROVAL_TYPE_NUMBER_REGEX_PARTIAL_MATCH,
} from '@/src/app/models/approval-type.model';
import { KeyValuePipe } from '@angular/common';
import { Component, OnChanges, OnDestroy, SimpleChanges, forwardRef, inject, input, model } from '@angular/core';
import {
	AbstractControl,
	ControlContainer,
	ControlValueAccessor,
	FormBuilder,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';

import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
	selector: 'approval-type-number-input',
	templateUrl: 'approval-type-number.html',
	styleUrls: ['./approval-type-number.scss'],
	imports: [FormsModule, KeyValuePipe, ReactiveFormsModule, ReactiveFormsModule, ApprovalTypeFocusNextDirective],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ApprovalTypeNumber),
			multi: true,
		},
	],
})
export class ApprovalTypeNumber implements ControlValueAccessor, OnChanges, OnDestroy {
	readonly width = input.required<FormNodeWidth>();

	readonly controlLabel = input.required<string>({ alias: 'label' });

	readonly controlName = input.required<string>({ alias: 'formControlName' });

	readonly disabled = input(false);

	readonly approvalType = input.required<string | null>();

	value = model<string | null | undefined>(null);

	readonly ApprovalType = ApprovalType;
	readonly FormNodeWidth = FormNodeWidth;

	fb = inject(FormBuilder);
	controlContainer = inject(ControlContainer);
	commonValidators = inject(CommonValidatorsService);
	destroy = new ReplaySubject<boolean>(1);

	form = this.fb.group({
		approvalTypeNumber1: this.fb.nonNullable.control<string>(''),
		approvalTypeNumber2: this.fb.nonNullable.control<string>(''),
		approvalTypeNumber3: this.fb.nonNullable.control<string>(''),
		approvalTypeNumber4: this.fb.nonNullable.control<string>(''),
	});

	get id() {
		return this.controlName();
	}

	get errorId() {
		return `${this.id}-error`;
	}

	get control() {
		return this.controlContainer.control?.get(this.controlName()) as AbstractControl;
	}

	get hasError() {
		return this.control?.invalid && this.control?.touched && this.control?.errors;
	}

	onChange = (_: any) => {};
	onTouched = () => {};

	writeValue(value: string | null): void {
		this.value.set(value);
		this.parseApprovalTypeNumber(value);
		this.onChange(value);
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	ngOnInit() {
		this.form.valueChanges.pipe(takeUntil(this.destroy)).subscribe(() => {
			const approvalTypeNumber1 = this.form?.get('approvalTypeNumber1')?.value;
			const approvalTypeNumber2 = this.form?.get('approvalTypeNumber2')?.value;
			const approvalTypeNumber3 = this.form?.get('approvalTypeNumber3')?.value;
			const approvalTypeNumber4 = this.form?.get('approvalTypeNumber4')?.value;

			const approvalTypeNumber = this.processApprovalTypeNumber(
				approvalTypeNumber1,
				approvalTypeNumber2,
				approvalTypeNumber3,
				approvalTypeNumber4
			);

			this.onChange(approvalTypeNumber);
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['approvalType']) {
			this.form.reset();
		}
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}

	parseApprovalTypeNumber(approvalTypeNumber: string | null) {
		const approvalType = this.approvalType();
		if (!approvalTypeNumber || !approvalType) return;

		// Handle NTA/IVA/IVA DVSA-NI approval type numbers
		const group1: string[] = [ApprovalType.NTA, ApprovalType.IVA, ApprovalType.IVA_DVSA_NI];

		if (group1.includes(approvalType)) {
			return this.parseGroup1ApprovalTypeNumber(approvalTypeNumber);
		}

		// Handle other approval type numbers
		const group2: string[] = [
			ApprovalType.ECTA,
			ApprovalType.NSSTA,
			ApprovalType.ECSSTA,
			ApprovalType.GB_WVTA,
			ApprovalType.UKNI_WVTA,
			ApprovalType.EU_WVTA_PRE_23,
			ApprovalType.EU_WVTA_23_ON,
			ApprovalType.QNIG,
			ApprovalType.PROV_GB_WVTA,
			ApprovalType.IVA_VCA,
			ApprovalType.SMALL_SERIES_NKSXX,
			ApprovalType.SMALL_SERIES_NKS,
		];

		if (group2.includes(approvalType)) {
			return this.parseGroup2ApprovalTypeNumber(approvalTypeNumber);
		}
	}

	parseGroup1ApprovalTypeNumber(value: string) {
		const approvalType = this.approvalType();
		if (!approvalType) return;
		const pattern = APPROVAL_NUMBER_TYPE_REGEX[approvalType];
		const matches = value.match(pattern)?.map((x) => (x.length > 25 ? x.substring(0, 25) : x)) || [];
		this.patchApprovalTypeNumberFromMatches(matches);
	}

	parseGroup2ApprovalTypeNumber(value: string) {
		const approvalType = this.approvalType();
		if (!approvalType) return;

		let matches: string[] = [];

		// Step 1: try to match pattern exactly
		const pattern1 = APPROVAL_NUMBER_TYPE_REGEX[approvalType];
		matches = value.match(pattern1)?.slice(1)?.filter(Boolean) || [];
		this.patchApprovalTypeNumberFromMatches(matches);

		// Step 2: if no matches, match leading characters against the partial pattern
		if (!matches.length) {
			const pattern2 = APPROVAL_TYPE_NUMBER_REGEX_PARTIAL_MATCH[approvalType] || /^$/;
			const limit = APPROVAL_TYPE_NUMBER_CHARACTER_LIMIT[approvalType];
			const limitedValue = value.length > limit ? value.substring(0, limit) : value;
			matches = limitedValue.match(pattern2)?.slice(1)?.filter(Boolean) || [];
			this.patchApprovalTypeNumberFromMatches(matches);
		}

		// Step 3: if no matches, match leading characters against the generic pattern
		if (!matches.length) {
			const pattern3 = APPROVAL_TYPE_NUMBER_REGEX_GENERIC_PARTIAL_MATCH[approvalType] || /^$/;
			const limit = APPROVAL_TYPE_NUMBER_CHARACTER_LIMIT_GENERIC[approvalType];
			const limitedValue = value.length > limit ? value.substring(0, limit) : value;
			matches = limitedValue.match(pattern3)?.slice(1)?.filter(Boolean) || [];
			this.patchApprovalTypeNumberFromMatches(matches);
		}

		// Step 4: if still not matches, error to report unparseable approval type number
		if (!matches.length) {
			console.error('Unknown approval type number:', approvalType, value);
		}
	}

	patchApprovalTypeNumberFromMatches(matches: string[]) {
		this.form?.patchValue({
			approvalTypeNumber1: matches[0],
			approvalTypeNumber2: matches[1],
			approvalTypeNumber3: matches[2],
			approvalTypeNumber4: matches[3],
		});
	}

	processApprovalTypeNumber(
		approvalTypeNumber1: string | undefined,
		approvalTypeNumber2: string | undefined,
		approvalTypeNumber3: string | undefined,
		approvalTypeNumber4: string | undefined
	) {
		switch (this.approvalType()) {
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
