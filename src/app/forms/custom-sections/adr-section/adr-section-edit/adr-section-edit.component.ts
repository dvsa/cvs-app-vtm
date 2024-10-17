import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ADRAdditionalNotesNumber } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrAdditionalNotesNumber.enum.js';
import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum.js';
import { ADRCompatibilityGroupJ } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrCompatibilityGroupJ.enum.js';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';
import { ADRTankDetailsTankStatementSelect } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankDetailsTankStatementSelect.enum.js';
import { ADRTankStatementSubstancePermitted } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankStatementSubstancePermitted.js';
import { TC3Types } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/tc3Types.enum.js';
import { AdditionalExaminerNotes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { AdrValidatorsService } from '@forms/validators/adr-validators.service';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { TC2Types } from '@models/adr.enum';
import { Store } from '@ngrx/store';
import { AdrService } from '@services/adr/adr.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { updateScrollPosition } from '@store/technical-records';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-adr-section-edit',
	templateUrl: './adr-section-edit.component.html',
	styleUrls: ['./adr-section-edit.component.scss'],
})
export class AdrSectionEditComponent implements OnInit, OnDestroy {
	fb = inject(FormBuilder);
	store = inject(Store);
	router = inject(Router);
	route = inject(ActivatedRoute);
	adrService = inject(AdrService);
	adrValidators = inject(AdrValidatorsService);
	commonValidators = inject(CommonValidatorsService);
	controlContainer = inject(ControlContainer);
	viewportScroller = inject(ViewportScroller);
	technicalRecordService = inject(TechnicalRecordService);

	techRecord = input.required<TechRecordType<'hgv' | 'lgv' | 'trl'>>();

	destroy$ = new ReplaySubject<boolean>(1);

	form = this.fb.group({
		techRecord_adrDetails_dangerousGoods: this.fb.control<boolean>(false),

		// Applicant Details
		techRecord_adrDetails_applicantDetails_name: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(150, 'Name must be less than or equal to 150 characters'),
		]),
		techRecord_adrDetails_applicantDetails_street: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(150, 'Street must be less than or equal to 150 characters'),
		]),
		techRecord_adrDetails_applicantDetails_town: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(100, 'Town must be less than or equal to 100 characters'),
		]),
		techRecord_adrDetails_applicantDetails_city: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(100, 'City must be less than or equal to 100 characters'),
		]),
		techRecord_adrDetails_applicantDetails_postcode: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(25, 'Postcode must be less than or equal to 25 characters'),
		]),

		// ADR Details
		techRecord_adrDetails_vehicleDetails_type: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithDangerousGoods('ADR body type is required with Able to carry dangerous goods'),
		]),
		techRecord_adrDetails_vehicleDetails_usedOnInternationalJourneys: this.fb.control<string | null>(null),
		techRecord_adrDetails_vehicleDetails_approvalDate: this.fb.control<string | null>(null, [
			this.commonValidators.pastDate('Date processed must be in the past'),
			this.adrValidators.requiredWithDangerousGoods('Date processed is required with Able to carry dangerous goods'),
		]),
		techRecord_adrDetails_permittedDangerousGoods: this.fb.control<string[] | null>(
			[],
			[
				this.adrValidators.requiredWithDangerousGoods(
					'Permitted dangerous goods is required with Able to carry dangerous goods'
				),
			]
		),
		techRecord_adrDetails_compatibilityGroupJ: this.fb.control<boolean | null>(null, [
			this.adrValidators.requiredWithExplosives('Compatibility group J is required with Permitted dangerous goods'),
		]),
		techRecord_adrDetails_additionalNotes_number: this.fb.control<string[]>(
			[],
			[this.adrValidators.requiredWithDangerousGoods('Guidance notes is required with Able to carry dangerous goods')]
		),
		techRecord_adrDetails_adrTypeApprovalNo: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(40, 'ADR type approval number must be less than or equal to 40 characters'),
		]),

		// Tank Details
		techRecord_adrDetails_tank_tankDetails_tankManufacturer: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithTankOrBattery('Tank Make is required with ADR body type'),
			this.commonValidators.maxLength(70, 'Tank Make must be less than or equal to 70 characters'),
		]),
		techRecord_adrDetails_tank_tankDetails_yearOfManufacture: this.fb.control<number | null>(null, [
			this.adrValidators.requiredWithTankOrBattery('Tank Year of manufacture is required with ADR body type'),
			this.commonValidators.min(1000, 'Tank Year of manufacture must be greater than or equal to 1000'),
			this.commonValidators.max(9999, 'Tank Year of manufacture must be less than or equal to 9999'),
		]),
		techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithTankOrBattery('Manufacturer serial number is required with ADR body type'),
			this.commonValidators.maxLength(70, 'Manufacturer serial number must be less than or equal to 70 characters'),
		]),
		techRecord_adrDetails_tank_tankDetails_tankTypeAppNo: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithTankOrBattery('Tank type approval number is required with ADR body type'),
			this.commonValidators.maxLength(65, 'Tank type approval number must be less than or equal to 65 characters'),
		]),
		techRecord_adrDetails_tank_tankDetails_tankCode: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithTankOrBattery('Code is required with ADR body type'),
			this.commonValidators.maxLength(30, 'Code must be less than or equal to 30 characters'),
		]),
		techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithTankOrBattery('Substances permitted is required with ADR body type'),
		]),
		techRecord_adrDetails_tank_tankDetails_tankStatement_select: this.fb.control<string | null>(
			null,
			this.adrValidators.requiredWithTankStatement('Select is required with Substances permitted')
		),
		techRecord_adrDetails_tank_tankDetails_tankStatement_statement: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(1500, 'Reference number must be less than or equal to 1500 characters'),
		]),
		techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(1500, 'Reference number must be less than or equal to 1500 characters'),
			this.adrValidators.requiresAUnNumberOrReferenceNumber(
				'Reference number or UN number 1 is required when selecting Product List'
			),
		]),
		techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: this.fb.array(
			[
				this.fb.control<string | null>(null, [
					this.commonValidators.maxLength(1500, 'UN number 1 must be less than or equal to 1500 characters'),
				]),
			],
			[
				this.adrValidators.requiresAllUnNumbersToBePopulated(),
				this.adrValidators.requiresAUnNumberOrReferenceNumber(
					'Reference number or UN number 1 is required when selecting Product List'
				),
			]
		),
		techRecord_adrDetails_tank_tankDetails_tankStatement_productList: this.fb.control<string | null>(null, []),
		techRecord_adrDetails_tank_tankDetails_specialProvisions: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(1500, 'Special provisions must be less than or equal to 1500 characters'),
		]),

		// Tank Details > Tank Inspections
		techRecord_adrDetails_tank_tankDetails_tc2Details_tc2Type: this.fb.control<string | null>(TC2Types.INITIAL),
		techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithTankOrBattery('TC2: Certificate Number is required with ADR body type'),
			this.commonValidators.maxLength(70, 'TC2: Certificate Number must be less than or equal to 70 characters'),
		]),
		techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithTankOrBattery('TC2: Expiry Date is required with ADR body type'),
		]),
		techRecord_adrDetails_tank_tankDetails_tc3Details: this.fb.array<FormGroup>([]),

		// Miscellaneous
		techRecord_adrDetails_memosApply: this.fb.control<string | null>(null),
		techRecord_adrDetails_m145Statement: this.fb.control<string | null>(null),

		// Battery List
		techRecord_adrDetails_listStatementApplicable: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithBattery('Battery List Applicable is required with ADR body type'),
		]),
		techRecord_adrDetails_batteryListNumber: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithBatteryListApplicable('Reference Number is required with Battery List Applicable'),
			this.commonValidators.maxLength(8, 'Reference Number must be less than or equal to 8 characters'),
		]),

		// Brake declaration
		techRecord_adrDetails_brakeDeclarationsSeen: this.fb.control<boolean>(false),
		techRecord_adrDetails_brakeDeclarationIssuer: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(500, 'Issuer must be lest than or equal to 500 characters'),
		]),
		techRecord_adrDetails_brakeEndurance: this.fb.control<boolean>(false),
		techRecord_adrDetails_weight: this.fb.control<number | null>(null, [
			this.commonValidators.max(99999999, 'Weight (tonnes) must be less than or equal to 99999999'),
			this.adrValidators.requiredWithBrakeEndurance('Weight (tonnes) is required with Brake Endurance'),
			this.commonValidators.pattern('^\\d*(\\.\\d{0,2})?$', 'Weight (tonnes) must be a number'),
		]),

		// Other declarations
		techRecord_adrDetails_declarationsSeen: this.fb.control<boolean>(false),

		// Miscellaneous
		techRecord_adrDetails_newCertificateRequested: this.fb.control<boolean>(false),
		techRecord_adrDetails_additionalExaminerNotes_note: this.fb.control<string | null>(null),
		techRecord_adrDetails_additionalExaminerNotes: this.fb.control<AdditionalExaminerNotes[] | null>(null),
		techRecord_adrDetails_adrCertificateNotes: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(1500, 'ADR Certificate Notes must be less han or equal to 1500 characters'),
		]),
	});

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
		{ value: ADRCompatibilityGroupJ.I, label: 'Yes' },
		{ value: ADRCompatibilityGroupJ.E, label: 'No' },
	];

	tankStatementSubstancePermittedOptions = getOptionsFromEnum(ADRTankStatementSubstancePermitted);

	tankStatementSelectOptions = getOptionsFromEnum(ADRTankDetailsTankStatementSelect);

	batteryListApplicableOptions = [
		{ value: true, label: 'Yes' },
		{ value: false, label: 'No' },
	];

	tc3InspectionOptions = getOptionsFromEnum(TC3Types);

	memosApplyOptions = [{ value: '07/09 3mth leak ext ', label: 'Yes' }];

	isInvalid(formControlName: string) {
		const control = this.form.get(formControlName);
		return control?.invalid && control?.touched;
	}

	toggle(formControlName: string, value: string) {
		const control = this.form.get(formControlName);
		if (!control) return;

		if (control.value === null) {
			return control.setValue([value]);
		}

		const arr = [...control.value];
		arr.includes(value) ? arr.splice(arr.indexOf(value), 1) : arr.push(value);
		control.setValue(arr);
	}

	ngOnInit(): void {
		// Attatch all form controls to parent
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			Object.entries(this.form.controls).forEach(([key, control]) =>
				parent.addControl(key, control, { emitEvent: false })
			);
		}

		this.handleADRBodyTypeChange();
	}

	ngOnDestroy(): void {
		// Detatch all form controls from parent
		const parent = this.controlContainer.control;
		if (parent instanceof FormGroup) {
			Object.keys(this.form.controls).forEach((key) => parent.removeControl(key, { emitEvent: false }));
		}

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	handleADRBodyTypeChange() {
		this.form.controls.techRecord_adrDetails_vehicleDetails_type.valueChanges
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				const options = getOptionsFromEnum(ADRDangerousGood);

				// When the ADR body type is a tank or battery, remove the explosives type 2 and 3 from the permitted dangerous goods list
				if (this.adrService.canDisplayTankOrBatterySection(this.form.getRawValue() as any)) {
					this.form.patchValue({
						techRecord_adrDetails_permittedDangerousGoods:
							this.form.controls.techRecord_adrDetails_permittedDangerousGoods.value?.filter((good) => {
								return good !== ADRDangerousGood.EXPLOSIVES_TYPE_2 && good !== ADRDangerousGood.EXPLOSIVES_TYPE_3;
							}),
						techRecord_adrDetails_compatibilityGroupJ: null,
					});

					this.permittedDangerousGoodsOptions = options.filter(({ value }) => {
						return value !== ADRDangerousGood.EXPLOSIVES_TYPE_2 && value !== ADRDangerousGood.EXPLOSIVES_TYPE_3;
					});
				} else {
					this.permittedDangerousGoodsOptions = options;
				}
			});
	}

	addTC3TankInspection() {
		this.form.controls.techRecord_adrDetails_tank_tankDetails_tc3Details.push(
			this.fb.group({
				tc3Type: this.fb.control<string | null>(null, [
					this.adrValidators.requiresOnePopulatedTC3Field(
						'TC3 Subsequent inspection must have at least one populated field'
					),
				]),
				tc3PeriodicNumber: this.fb.control<string | null>(null, [
					this.commonValidators.maxLength(75, 'TC3: Certificate Number must be less than or equal to 75 characters'),
					this.adrValidators.requiresOnePopulatedTC3Field(
						'TC3 Subsequent inspection must have at least one populated field'
					),
				]),
				tc3PeriodicExpiryDate: this.fb.control<string | null>(null, [
					this.adrValidators.requiresOnePopulatedTC3Field(
						'TC3 Subsequent inspection must have at least one populated field'
					),
				]),
			})
		);
	}

	removeTC3TankInspection(index: number) {
		this.form.controls.techRecord_adrDetails_tank_tankDetails_tc3Details.removeAt(index);
	}

	addUNNumber() {
		const arr = this.form.controls.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo;
		const allNumbersPopulated = arr.value.every((value: string | null) => !!value);

		if (allNumbersPopulated) {
			arr.push(
				this.fb.control<string | null>(null, [
					this.commonValidators.maxLength(
						1500,
						`UN number ${arr.length + 1} must be less than or equal to 1500 characters`
					),
				])
			);
		}

		arr.markAsTouched();
		arr.updateValueAndValidity();
	}

	removeUNNumber(index: number) {
		this.form.controls.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo.removeAt(index);
	}

	getEditAdditionalExaminerNotePage(examinerNoteIndex: number) {
		const reason = this.route.snapshot.data['reason'];
		const route = `../${reason}/edit-additional-examiner-note/${examinerNoteIndex}`;

		this.store.dispatch(updateScrollPosition({ position: this.viewportScroller.getScrollPosition() }));
		this.router.navigate([route], { relativeTo: this.route, state: this.techRecord });
	}
}
