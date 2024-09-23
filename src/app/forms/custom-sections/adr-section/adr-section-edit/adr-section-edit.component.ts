import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { ADRAdditionalNotesNumber } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrAdditionalNotesNumber.enum';
import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum';
import { ADRTankDetailsTankStatementSelect } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankDetailsTankStatementSelect.enum';
import { ADRTankStatementSubstancePermitted } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankStatementSubstancePermitted';
import { TC3Types } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/tc3Types.enum';
import { AdditionalExaminerNotes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { TC2Types } from '@models/adr.enum';
import { Store } from '@ngrx/store';
import { AdrService } from '@services/adr/adr.service';
import { techRecord } from '@store/technical-records';
import { ReplaySubject, take } from 'rxjs';

@Component({
	selector: 'app-adr-section-edit',
	templateUrl: './adr-section-edit.component.html',
	styleUrls: ['./adr-section-edit.component.scss'],
})
export class AdrSectionEditComponent implements OnInit, OnDestroy {
	fb = inject(FormBuilder);
	store = inject(Store);
	adrService = inject(AdrService);
	controlContainer = inject(ControlContainer);

	destroy$ = new ReplaySubject<boolean>(1);

	form = this.fb.group(
		{
			techRecord_adrDetails_dangerousGoods: this.fb.control<boolean>(false),

			// Applicant Details
			techRecord_adrDetails_applicantDetails_name: this.fb.control<string | null>(null, [this.maxLength(150, 'Name')]),
			techRecord_adrDetails_applicantDetails_street: this.fb.control<string | null>(null, [
				this.maxLength(150, 'Street'),
			]),
			techRecord_adrDetails_applicantDetails_town: this.fb.control<string | null>(null, [this.maxLength(100, 'Town')]),
			techRecord_adrDetails_applicantDetails_city: this.fb.control<string | null>(null, [this.maxLength(100, 'City')]),
			techRecord_adrDetails_applicantDetails_postcode: this.fb.control<string | null>(null, [
				this.maxLength(25, 'Postcode'),
			]),

			// ADR Details
			techRecord_adrDetails_vehicleDetails_type: this.fb.control<string | null>(null, [
				this.requiredWithDangerousGoods('ADR body type'),
			]),
			techRecord_adrDetails_vehicleDetails_usedOnInternationalJourneys: this.fb.control<string | null>(null),
			techRecord_adrDetails_vehicleDetails_approvalDate: this.fb.control<string | null>(null, [
				//this.invalidDate('Date processed'),
				this.pastDate('Date processed'),
				this.requiredWithDangerousGoods('Date processed'),
			]),
			techRecord_adrDetails_permittedDangerousGoods: this.fb.control<string[] | null>(null, [
				this.requiredWithDangerousGoods('Permitted dangerous goods'),
			]),
			techRecord_adrDetails_compatibilityGroupJ: this.fb.control<string | null>(null, [
				this.requiredWithExplosives('Compatibility Group J'),
			]),
			techRecord_adrDetails_additionalNotes_number: this.fb.control<string[]>(
				[],
				[this.requiredWithDangerousGoods('Guidance notes')]
			),
			techRecord_adrDetails_adrTypeApprovalNo: this.fb.control<string | null>(null, [
				this.maxLength(40, 'ADR type approval number'),
			]),

			// Tank Details
			techRecord_adrDetails_tank_tankDetails_tankManufacturer: this.fb.control<string | null>(null, [
				this.requiredWithTankOrBattery('Tank Make'),
				this.maxLength(70, 'Tank Make'),
			]),
			techRecord_adrDetails_tank_tankDetails_yearOfManufacture: this.fb.control<string | null>(null, [
				this.requiredWithTankOrBattery('Tank Year of manufacture'),
				this.maxLength(70, 'Tank Year of manufacture'),
			]),
			techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo: this.fb.control<string | null>(null, [
				this.requiredWithTankOrBattery('Manufacturer serial number'),
				this.maxLength(70, 'Manufacturer serial number'),
			]),
			techRecord_adrDetails_tank_tankDetails_tankTypeAppNo: this.fb.control<string | null>(null, [
				this.requiredWithTankOrBattery('Tank type approval number'),
				this.maxLength(65, 'Tank type approval number'),
			]),
			techRecord_adrDetails_tank_tankDetails_tankCode: this.fb.control<string | null>(null, [
				this.requiredWithTankOrBattery('Code'),
				this.maxLength(30, 'Code'),
			]),
			techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted: this.fb.control<string | null>(null, [
				this.requiredWithTankOrBattery('Substances permitted'),
			]),
			techRecord_adrDetails_tank_tankDetails_tankStatement_select: this.fb.control<string | null>(
				null,
				this.requiredWithTankStatement('Select')
			),
			techRecord_adrDetails_tank_tankDetails_tankStatement_statement: this.fb.control<string | null>(null, [
				this.requiredWithUNNumber('Reference number'),
				this.maxLength(1500, 'Reference number'),
			]),
			techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo: this.fb.control<string | null>(null, [
				this.maxLength(1500, 'Reference number'),
			]),
			techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: this.fb.array([
				this.fb.control<string | null>(null, [
					this.requiredWithTankStatementProductList('UN Number'),
					this.maxLength(1500, 'UN number'),
				]),
			]),
			techRecord_adrDetails_tank_tankDetails_tankStatement_productList: this.fb.control<string | null>(null, []),
			techRecord_adrDetails_tank_tankDetails_specialProvisions: this.fb.control<string | null>(null, [
				this.maxLength(1500, 'Special provisions'),
			]),

			// Tank Details > Tank Inspections
			techRecord_adrDetails_tank_tankDetails_tc2Details_tc2Type: this.fb.control<string | null>(TC2Types.INITIAL),
			techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo: this.fb.control<string | null>(
				null,
				[this.requiredWithTankOrBattery('TC2: Certificate Number'), this.maxLength(70, 'TC2: Certificate Number')]
			),
			techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate: this.fb.control<string | null>(
				null,
				[this.requiredWithTankOrBattery('TC2: Expiry Date')]
			),
			techRecord_adrDetails_tank_tankDetails_tc3Details: this.fb.array<FormGroup>([]),

			// Miscellaneous
			techRecord_adrDetails_memosApply: this.fb.control<string | null>(null),
			techRecord_adrDetails_m145Statement: this.fb.control<string | null>(null),

			// Battery List
			techRecord_adrDetails_listStatementApplicable: this.fb.control<string | null>(null, [
				this.requiredWithBattery('Battery list applicable'),
			]),
			techRecord_adrDetails_batteryListNumber: this.fb.control<string | null>(null, [
				this.requiredWithBatteryListApplicable('Reference Number'),
			]),

			// Brake declaration
			techRecord_adrDetails_brakeDeclarationsSeen: this.fb.control<boolean>(false),
			techRecord_adrDetails_brakeDeclarationIssuer: this.fb.control<string | null>(null, [
				this.maxLength(500, 'Issuer'),
			]),
			techRecord_adrDetails_brakeEndurance: this.fb.control<boolean>(false),
			techRecord_adrDetails_weight: this.fb.control<number | null>(null, [
				this.max(99999999, 'Weight (tonnes)'),
				this.requiredWithBrakeEndurance('Weight (tonnes)'),
				this.pattern('^\\d*(\\.\\d{0,2})?$', 'Weight (tonnes)'),
			]),

			// Other declarations
			techRecord_adrDetails_declarationsSeen: this.fb.control<boolean>(false),

			// Miscellaneous
			techRecord_adrDetails_newCertificateRequested: this.fb.control<boolean>(false),
			techRecord_adrDetails_additionalExaminerNotes_note: this.fb.control<string | null>(null),
			techRecord_adrDetails_additionalExaminerNotes: this.fb.control<AdditionalExaminerNotes[] | null>(null),
			techRecord_adrDetails_adrCertificateNotes: this.fb.control<string | null>(null, [
				this.maxLength(1500, 'ADR Certificate Notes'),
			]),
		},
		{ validators: [this.requiresReferenceNumberOrUNNumber()] }
	);

	// Option lists
	dangerousGoodsOptions = [
		{ label: 'Yes', value: true },
		{ label: 'No', value: false },
	];

	adrBodyTypesOptions = getOptionsFromEnum(ADRBodyType);

	usedOnInternationJourneysOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'n/a', label: 'Not applicable' },
	];

	permittedDangerousGoodsOptions = getOptionsFromEnum(ADRDangerousGood);

	guidanceNotesOptions = getOptionsFromEnum(ADRAdditionalNotesNumber);

	compatibilityGroupJOptions = [
		{ label: 'Yes', value: true },
		{ label: 'No', value: false },
	];

	tankStatementSubstancePermittedOptions = getOptionsFromEnum(ADRTankStatementSubstancePermitted);

	tankStatementSelectOptions = getOptionsFromEnum(ADRTankDetailsTankStatementSelect);

	batteryListApplicableOptions = [
		{ value: true, label: 'Yes' },
		{ value: false, label: 'No' },
	];

	tc3InspectionOptions = getOptionsFromEnum(TC3Types);

	isInvalid(formControlName: string) {
		const control = this.form.get(formControlName);
		return control?.invalid && control?.touched;
	}

	toggle(formControlName: string, value: string) {
		const control = this.form.get(formControlName);
		if (!control) return;

		// If this is the first checkbox, set the value to an array
		if (control.value === null) {
			return control.setValue([value]);
		}

		// If the value is already an array, toggle the value - if the array is then empty, set the value to null
		if (Array.isArray(control.value)) {
			control.value.includes(value) ? control.value.splice(control.value.indexOf(value), 1) : control.value.push(value);
			if (control.value.length === 0) {
				control.setValue(null);
			}
		}
	}

	ngOnInit(): void {
		// Attatch all form controls to parent
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			Object.entries(this.form.controls).forEach(([key, control]) => parent.addControl(key, control));
		}

		this.store
			.select(techRecord)
			.pipe(take(1))
			.subscribe((techRecord) => {
				if (techRecord) this.form.patchValue(techRecord as any);
			});
	}

	ngOnDestroy(): void {
		// Detatch all form controls from parent
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			Object.keys(this.form.controls).forEach((key) => parent.removeControl(key));
		}

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	// Custom validators
	requiredWithDangerousGoods(label: string): ValidatorFn {
		return (control) => {
			if (control.parent && !control.value && this.adrService.canDisplayDangerousGoodsSection(control.parent.value)) {
				return { required: `${label} is required when dangerous goods are present` };
			}

			return null;
		};
	}

	requiredWithExplosives(label: string): ValidatorFn {
		return (control) => {
			if (
				control.parent &&
				!control.value &&
				this.adrService.canDisplayCompatibilityGroupJSection(control.parent.value)
			) {
				return { required: `${label} is required when Explosives Type 2 or Explosive Type 3` };
			}

			return null;
		};
	}

	requiredWithBattery(label: string): ValidatorFn {
		return (control) => {
			if (control.parent && !control.value && this.adrService.canDisplayBatterySection(control.parent.value)) {
				return { required: `${label} is required when ADR body type is of type 'battery'` };
			}

			return null;
		};
	}

	requiredWithTankOrBattery(label: string): ValidatorFn {
		return (control) => {
			if (control.parent && !control.value && this.adrService.canDisplayTankOrBatterySection(control.parent.value)) {
				return { required: `${label} is required when ADR body type is of type 'tank' or 'battery'` };
			}

			return null;
		};
	}

	requiredWithTankStatement(label: string): ValidatorFn {
		return (control) => {
			if (
				control.parent &&
				!control.value &&
				this.adrService.canDisplayTankStatementSelectSection(control.parent.value)
			) {
				return { required: `${label} is required with substances permitted` };
			}

			return null;
		};
	}

	requiredWithUNNumber(label: string): ValidatorFn {
		return (control) => {
			if (
				control.parent &&
				!control.value &&
				this.adrService.canDisplayTankStatementStatementSection(control.parent.value)
			) {
				return { required: `${label} is required when under UN number` };
			}

			return null;
		};
	}

	requiredWithBrakeEndurance(label: string): ValidatorFn {
		return (control) => {
			if (control.parent && !control.value && this.adrService.canDisplayWeightSection(control.parent.value)) {
				return { required: `${label} is required when brake endurance is checked` };
			}

			return null;
		};
	}

	requiredWithBatteryListApplicable(label: string): ValidatorFn {
		return (control) => {
			if (
				control.parent &&
				!control.value &&
				this.adrService.canDisplayBatteryListNumberSection(control.parent.value)
			) {
				return { required: `${label} is required when battery list is applicable` };
			}

			return null;
		};
	}

	requiredWithTankStatementProductList(label: string): ValidatorFn {
		return (control) => {
			const visible = control.parent && this.adrService.canDisplayTankStatementProductListSection(control.parent.value);
			if (visible && !control.value) {
				return { required: `${label} is required when under product list` };
			}

			return null;
		};
	}

	requiresReferenceNumberOrUNNumber(): ValidatorFn {
		return (control) => {
			const referenceNumber = control.get('techRecord_adrDetails_tank_tankDetails_tankStatement_statement')?.value;
			const unNumbers = control.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo')?.value;
			const visible = control.parent && this.adrService.canDisplayTankStatementProductListSection(control.parent.value);
			const unNumberPopulated = Array.isArray(unNumbers) && unNumbers.some((un) => un !== null);

			if (visible && (!referenceNumber || !unNumberPopulated)) {
				return { required: 'Either reference number or UN number is required' };
			}

			return null;
		};
	}

	max(size: number, label: string): ValidatorFn {
		return (control) => {
			if (control.value && control.value > size) {
				return { max: `${label} must be less than or equal to ${size}` };
			}

			return null;
		};
	}

	maxLength(length: number, label: string): ValidatorFn {
		return (control) => {
			if (control.value && control.value.length > length) {
				return { maxLength: `${label} must be less than or equal to ${length} characters` };
			}

			return null;
		};
	}

	pattern(pattern: string | RegExp, label: string): ValidatorFn {
		return (control) => {
			if (control.value && !new RegExp(pattern).test(control.value)) {
				return { pattern: `${label} is invalid` };
			}

			return null;
		};
	}

	pastDate(label: string): ValidatorFn {
		return (control) => {
			if (control.value && new Date(control.value) > new Date()) {
				return { pastDate: `${label} must be in the past` };
			}

			return null;
		};
	}

	invalidDate(label: string): ValidatorFn {
		return (control) => {
			if (control.value && Number.isNaN(Date.parse(control.value))) {
				return { invalidDate: `${label} is not a valid date` };
			}

			return null;
		};
	}

	// Dynamically add/remove controls
	addTC3TankInspection() {
		const formArray = this.form.get('techRecord_adrDetails_tank_tankDetails_tc3Details');
		if (formArray instanceof FormArray) {
			formArray.push(
				this.fb.group({
					tc3Type: this.fb.control<string | null>(null),
					tc3PeriodicNumber: this.fb.control<string | null>(null),
					tc3PeriodicExpiryDate: this.fb.control<string | null>(null),
				})
			);
		}
	}

	removeTC3TankInspection(index: number) {
		const formArray = this.form.get('techRecord_adrDetails_tank_tankDetails_tc3Details');
		if (formArray instanceof FormArray) {
			formArray.removeAt(index);
		}
	}

	addUNNumber() {
		const formArray = this.form.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo');
		if (formArray instanceof FormArray) {
			formArray.push(
				this.fb.control<string | null>(null, [
					this.requiredWithTankStatementProductList('UN Number'),
					this.maxLength(1500, 'UN number'),
				])
			);
		}
	}

	removeUNNumber(index: number) {
		const formArray = this.form.get('techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo');
		if (formArray instanceof FormArray) {
			formArray.removeAt(index);
		}
	}
}
