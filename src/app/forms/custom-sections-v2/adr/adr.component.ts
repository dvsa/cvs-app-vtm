import { NoSpaceDirective } from '@/src/app/directives/app-no-space/app-no-space.directive';
import { TrimWhitespaceDirective } from '@/src/app/directives/app-trim-whitespace/app-trim-whitespace.directive';
import { Modes } from '@/src/app/models/modes.enum';
import { AdrService } from '@/src/app/services/adr/adr.service';
import { TechnicalRecordChangesService } from '@/src/app/services/technical-record/technical-record-change.service';
import { techRecord } from '@/src/app/store/technical-records/technical-record-service.selectors';
import { DatePipe, ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { FilterByTagsDirective } from '@directives/filter-by-tags/filter-by-tags.directive';
import { ADRAdditionalNotesNumber } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrAdditionalNotesNumber.enum.js';
import { ADRBodyDeclarationTypes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyDeclarationType.enum.js';
import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum.js';
import { ADRCompatibilityGroupJ } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrCompatibilityGroupJ.enum.js';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';
import { ADRTankDetailsTankStatementSelect } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankDetailsTankStatementSelect.enum.js';
import { ADRTankStatementSubstancePermitted } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrTankStatementSubstancePermitted.js';
import { TC3Types } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/tc3Types.enum.js';
import { AdditionalExaminerNotes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { GovukCheckboxGroupComponent } from '@forms/components/govuk-checkbox-group/govuk-checkbox-group.component';
import { GovukFormGroupCheckboxComponent } from '@forms/components/govuk-form-group-checkbox/govuk-form-group-checkbox.component';
import { GovukFormGroupDateComponent } from '@forms/components/govuk-form-group-date/govuk-form-group-date.component';
import { GovukFormGroupInputComponent } from '@forms/components/govuk-form-group-input/govuk-form-group-input.component';
import { GovukFormGroupRadioComponent } from '@forms/components/govuk-form-group-radio/govuk-form-group-radio.component';
import { RadioComponent } from '@forms/components/govuk-form-group-radio/radio/radio.component';
import { GovukFormGroupSelectComponent } from '@forms/components/govuk-form-group-select/govuk-form-group-select.component';
import { GovukFormGroupTextareaComponent } from '@forms/components/govuk-form-group-textarea/govuk-form-group-textarea.component';
import { EditBaseComponent } from '@forms/custom-sections/edit-base-component/edit-base-component';
import { AdrValidatorsService } from '@forms/validators/adr-validators.service';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import {
	ADR_TANK_STATEMENT_SUBSTANCES_PERMITTED,
	PERMITTED_DANGEROUS_GOODS_OPTIONS,
	YES_NO_OPTIONS,
} from '@models/options.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { removeTC3TankInspection, removeUNNumber, updateScrollPosition } from '@store/technical-records';
import _ from 'lodash';
import { ReplaySubject, takeUntil } from 'rxjs';
import { getOptionsFromEnum } from '../../utils/enum-map';

@Component({
	selector: 'app-adr',
	templateUrl: './adr.component.html',
	styleUrls: ['./adr.component.scss'],
	imports: [
		GovukFormGroupDateComponent,
		ReactiveFormsModule,
		GovukFormGroupInputComponent,
		GovukFormGroupSelectComponent,
		GovukFormGroupRadioComponent,
		GovukCheckboxGroupComponent,
		RadioComponent,
		DatePipe,
		DefaultNullOrEmpty,
		GovukFormGroupCheckboxComponent,
		GovukFormGroupTextareaComponent,
		PaginationComponent,
		FilterByTagsDirective,
		TrimWhitespaceDirective,
		NoSpaceDirective,
	],
})
export class AdrComponent extends EditBaseComponent implements OnInit, OnDestroy {
	validators = inject(CommonValidatorsService);
	adrService = inject(AdrService);
	adrValidators = inject(AdrValidatorsService);
	router = inject(Router);
	route = inject(ActivatedRoute);
	viewportScroller = inject(ViewportScroller);
	tcs = inject(TechnicalRecordChangesService);

	filters = input<string[]>([]);
	mode = input.required<Modes>();

	// TODO properly type this at some point
	form = this.fb.group({
		techRecord_adrDetails_dangerousGoods: this.fb.control<boolean>(false),
		techRecord_adrDetails_receivedDate: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithADRApplicationApproved('Date application received'),
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayDangerousGoodsSection(control.root.getRawValue()),
				this.commonValidators.date('Date application received', 'adr', 'techRecord_adrDetails_receivedDate'),
				this.commonValidators.pastOrCurrentDate(
					'Date application received',
					'adr',
					'techRecord_adrDetails_receivedDate'
				)
			),
		]),
		techRecord_adrDetails_applicationNumber: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithADRApplicationApproved('ADR application number'),
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayDangerousGoodsSection(control.root.getRawValue()),
				this.commonValidators.pattern(
					/^APP-\d{7}-\d{4}-\d{1,2}$/,
					'Enter an ADR application number in the correct format, for example APP-0124958-0426-1',
					'adr',
					'techRecord_adrDetails_applicationNumber'
				)
			),
		]),
		// Applicant Details
		techRecord_adrDetails_applicantDetails_name: this.fb.control<string | null>(null, [
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayDangerousGoodsSection(control.root.getRawValue()),
				this.commonValidators.maxLength(150, 'Name', 'adr', 'techRecord_adrDetails_applicantDetails_name')
			),
		]),
		techRecord_adrDetails_applicantDetails_street: this.fb.control<string | null>(null, [
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayDangerousGoodsSection(control.root.getRawValue()),
				this.commonValidators.maxLength(150, 'Address line 1', 'adr', 'techRecord_adrDetails_applicantDetails_street')
			),
		]),
		techRecord_adrDetails_applicantDetails_town: this.fb.control<string | null>(null, [
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayDangerousGoodsSection(control.root.getRawValue()),
				this.commonValidators.maxLength(
					100,
					'Address line 2 (optional)',
					'adr',
					'techRecord_adrDetails_applicantDetails_town'
				)
			),
		]),
		techRecord_adrDetails_applicantDetails_city: this.fb.control<string | null>(null, [
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayDangerousGoodsSection(control.root.getRawValue()),
				this.commonValidators.maxLength(100, 'Town or city', 'adr', 'techRecord_adrDetails_applicantDetails_city')
			),
		]),
		techRecord_adrDetails_applicantDetails_postcode: this.fb.control<string | null>(null, [
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayDangerousGoodsSection(control.root.getRawValue()),
				this.commonValidators.maxLength(25, 'Postcode', 'adr', 'techRecord_adrDetails_applicantDetails_postcode')
			),
		]),
		// ADR Details
		techRecord_adrDetails_vehicleDetails_type: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithDangerousGoods('ADR body type'),
		]),
		techRecord_adrDetails_vehicleDetails_usedOnInternationalJourneys: this.fb.control<string | null>(null),
		techRecord_adrDetails_vehicleDetails_approvalDate: this.fb.control<string | null>(null, [
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayDangerousGoodsSection(control.root.getRawValue()),
				this.commonValidators.date('Date processed', 'techRecord_adrDetails_vehicleDetails_approvalDate', 'adr'),
				this.commonValidators.pastDate('Date processed', 'adr', 'techRecord_adrDetails_vehicleDetails_approvalDate')
			),
			this.adrValidators.requiredWithDangerousGoods('Date processed'),
		]),
		techRecord_adrDetails_permittedDangerousGoods: this.fb.control<string[] | null>(
			[],
			[this.adrValidators.requiredWithDangerousGoods('Permitted dangerous goods')]
		),
		techRecord_adrDetails_bodyDeclaration_type: this.fb.control<string | undefined>(undefined, []),
		techRecord_adrDetails_compatibilityGroupJ: this.fb.control<boolean | null>(null, [
			this.adrValidators.requiredWithExplosives('Compatibility group J'),
		]),
		techRecord_adrDetails_additionalNotes_number: this.fb.control<string[]>(
			[],
			[this.adrValidators.requiredWithDangerousGoods('Guidance notes')]
		),
		techRecord_adrDetails_adrTypeApprovalNo: this.fb.control<string | null>(null, [
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayDangerousGoodsSection(control.root.getRawValue()),
				this.commonValidators.maxLength(
					40,
					'ADR type approval number',
					'adr',
					'techRecord_adrDetails_adrTypeApprovalNo'
				)
			),
		]),

		// Tank Details
		techRecord_adrDetails_tank_tankDetails_tankManufacturer: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithTankOrBattery('Tank make'),
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayTankOrBatterySection(control.root.getRawValue()),
				this.commonValidators.maxLength(
					70,
					'Tank make',
					'adr',
					'techRecord_adrDetails_tank_tankDetails_tankManufacturer'
				)
			),
		]),
		techRecord_adrDetails_tank_tankDetails_yearOfManufacture: this.fb.control<number | null>(null, [
			this.adrValidators.requiredWithTankOrBattery('Tank year of manufacture'),
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayTankOrBatterySection(control.root.getRawValue()),
				this.commonValidators.pastOrCurrentYear(
					'Tank year of manufacture',
					'adr',
					'techRecord_adrDetails_tank_tankDetails_yearOfManufacture'
				),
				this.commonValidators.min(
					1000,
					'Tank year of manufacture',
					'',
					'adr',
					'techRecord_adrDetails_tank_tankDetails_yearOfManufacture'
				)
			),
		]),
		techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithTankOrBattery('Manufacturer serial number'),
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayTankOrBatterySection(control.root.getRawValue()),
				this.commonValidators.maxLength(
					50,
					'Manufacturer serial number',
					'adr',
					'techRecord_adrDetails_tank_tankDetails_tankManufacturerSerialNo'
				)
			),
		]),
		techRecord_adrDetails_tank_tankDetails_tankTypeAppNo: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithTankOrBattery('Tank type approval number'),
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayTankOrBatterySection(control.root.getRawValue()),
				this.commonValidators.maxLength(
					65,
					'Tank type approval number',
					'adr',
					'techRecord_adrDetails_tank_tankDetails_tankTypeAppNo'
				)
			),
		]),
		techRecord_adrDetails_tank_tankDetails_tankCode: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithTankOrBattery('Code'),
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayTankOrBatterySection(control.root.getRawValue()),
				this.commonValidators.maxLength(30, 'Code', 'adr', 'techRecord_adrDetails_tank_tankDetails_tankCode')
			),
		]),
		techRecord_adrDetails_tank_tankDetails_tankStatement_substancesPermitted: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithTankOrBattery('Substances permitted'),
		]),
		techRecord_adrDetails_tank_tankDetails_tankStatement_select: this.fb.control<string | null>(
			null,
			this.adrValidators.requiredWithTankStatement('Select')
		),
		techRecord_adrDetails_tank_tankDetails_tankStatement_statement: this.fb.control<string | null>(null, [
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayTankStatementStatementSection(control.root.getRawValue()),
				this.commonValidators.maxLength(
					1500,
					'Reference number',
					'adr',
					'techRecord_adrDetails_tank_tankDetails_tankStatement_statement'
				)
			),
		]),
		techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo: this.fb.control<string | null>(null, [
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayTankStatementProductListSection(control.root.getRawValue()),
				this.commonValidators.maxLength(
					1500,
					'Reference number',
					'adr',
					'techRecord_adrDetails_tank_tankDetails_tankStatement_productListRefNo'
				),
				this.adrValidators.requiresAUnNumberOrReferenceNumber(
					'Reference number or UN number 1 is required when selecting Product list'
				)
			),
		]),
		techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo: this.fb.array<FormControl<string | null>>(
			[],
			[
				this.commonValidators.applyWhen(
					(control) => this.adrService.canDisplayTankStatementProductListSection(control.root.getRawValue()),
					this.adrValidators.requiresAllUnNumbersToBePopulated(),
					this.adrValidators.requiresAUnNumberOrReferenceNumber(
						'Reference number or UN number 1 is required when selecting Product list'
					)
				),
			]
		),
		techRecord_adrDetails_tank_tankDetails_tankStatement_productList: this.fb.control<string | null>(null, [
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayTankStatementProductListSection(control.root.getRawValue()),
				this.commonValidators.maxLength(
					1500,
					'Additional details',
					'adr',
					'techRecord_adrDetails_tank_tankDetails_tankStatement_productList'
				)
			),
		]),
		techRecord_adrDetails_tank_tankDetails_specialProvisions: this.fb.control<string | null>(null, [
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayTankStatementProductListSection(control.root.getRawValue()),
				this.commonValidators.maxLength(
					1024,
					'Special provisions',
					'adr',
					'techRecord_adrDetails_tank_tankDetails_specialProvisions'
				)
			),
		]),
		techRecord_adrDetails_declarationsSeen: this.fb.control<boolean>(false),
		techRecord_adrDetails_brakeDeclarationsSeen: this.fb.control<boolean>(false),
		techRecord_adrDetails_brakeDeclarationIssuer: this.fb.control<string | null>(null, [
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayIssueSection(control.root.getRawValue()),
				this.commonValidators.maxLength(500, 'Issuer', 'adr', 'techRecord_adrDetails_brakeDeclarationIssuer')
			),
		]),
		techRecord_adrDetails_brakeEndurance: this.fb.control<boolean>(false),
		techRecord_adrDetails_weight: this.fb.control<number | null>(null, [
			this.adrValidators.requiredWithBrakeEndurance('Weight (tonnes)'),
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayWeightSection(control.root.getRawValue()),
				this.commonValidators.max(99999999, 'Weight (tonnes)', '', 'adr', 'techRecord_adrDetails_weight'),
				this.commonValidators.pattern(
					'^\\d*(\\.\\d{0,2})?$',
					'Weight (tonnes) Max 2 decimal places',
					'adr',
					'techRecord_adrDetails_weight'
				)
			),
		]),
		techRecord_adrDetails_newCertificateRequested: this.fb.control<boolean>(false),
		techRecord_adrDetails_additionalExaminerNotes: this.fb.control<AdditionalExaminerNotes[] | null>(null),
		techRecord_adrDetails_additionalExaminerNotes_note: this.fb.control<string | null>(null, [
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayDangerousGoodsSection(control.root.getRawValue()),
				this.commonValidators.maxLength(
					1024,
					'Additional examiner notes',
					'adr',
					'techRecord_adrDetails_additionalExaminerNotes_note'
				)
			),
		]),
		techRecord_adrDetails_adrCertificateNotes: this.fb.control<string | null>(null, [
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayDangerousGoodsSection(control.root.getRawValue()),
				this.commonValidators.maxLength(
					1500,
					'ADR certificate notes',
					'adr',
					'techRecord_adrDetails_adrCertificateNotes'
				)
			),
		]),
		// Tank Details > Tank Inspections
		techRecord_adrDetails_tank_tankDetails_tc2Details_tc2Type: this.fb.control<string | null>('initial'),
		techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithTankOrBattery('TC2: Certificate number'),
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayTankOrBatterySection(control.root.getRawValue()),
				this.commonValidators.maxLength(
					70,
					'TC2: Certificate Number',
					'adr',
					'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo'
				)
			),
		]),
		techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate: this.fb.control<string | null>(null, [
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayTankOrBatterySection(control.root.getRawValue()),
				this.commonValidators.date(
					'TC2: Expiry date',
					'techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate',
					'adr'
				)
			),
			this.adrValidators.requiredWithTankOrBattery('TC2: Expiry date'),
		]),
		techRecord_adrDetails_tank_tankDetails_tc3Details: this.fb.array<FormGroup>([]),

		// Miscellaneous
		techRecord_adrDetails_memosApply: this.fb.control<string | null>(null),
		techRecord_adrDetails_m145Statement: this.fb.control<boolean>(false),

		// Battery List
		techRecord_adrDetails_listStatementApplicable: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithBattery('Battery list applicable', true),
		]),
		techRecord_adrDetails_batteryListNumber: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithBatteryListApplicable('Reference number'),
			this.commonValidators.applyWhen(
				(control) => this.adrService.canDisplayBatteryListNumberSection(control.root.getRawValue()),
				this.commonValidators.maxLength(8, 'Reference number', 'adr', 'techRecord_adrDetails_batteryListNumber')
			),
		]),
		techRecord_adrDetails_approved: this.fb.control<boolean>(false),
	});

	adrBodyTypesOptions = getOptionsFromEnum(ADRBodyType);

	memosApplyOptions = [{ value: '07/09 3mth leak ext ', label: 'Yes' }];

	usedOnInternationJourneysOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'n/a', label: 'Not applicable' },
	];

	permittedDangerousGoodsOptions = PERMITTED_DANGEROUS_GOODS_OPTIONS;

	guidanceNotesOptions = getOptionsFromEnum(ADRAdditionalNotesNumber);

	compatibilityGroupJOptions = [
		{ value: ADRCompatibilityGroupJ.I, label: 'Yes' },
		{ value: ADRCompatibilityGroupJ.E, label: 'No' },
	];

	tc3InspectionOptions = getOptionsFromEnum(TC3Types);

	bodyDeclarationOptions = getOptionsFromEnum(ADRBodyDeclarationTypes);

	tankStatementSubstancePermittedOptions = getOptionsFromEnum(ADRTankStatementSubstancePermitted);

	tankStatementSelectOptions = getOptionsFromEnum(ADRTankDetailsTankStatementSelect);

	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<TechRecordType<'hgv' | 'lgv' | 'trl'>>();

	ngOnInit(): void {
		this.handleInitialiseUNNumbers();
		this.handleInitialiseSubsequentTankInspections();

		// Attach all form controls to parent
		this.init(this.form);

		this.handleADRBodyTypeChange();

		// Prepopulate form with current tech record
		this.form.patchValue(this.techRecord() as any);
	}

	getVehicleType(): VehicleTypes {
		return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord());
	}

	shouldDisplayFormControl(formControlName: string) {
		if (!this.form.get(formControlName)) return false;
		return this.mode() === Modes.SUMMARY ? this.tcs.hasChanged(formControlName) : true;
	}

	ngOnDestroy(): void {
		// Detach all form controls from parent
		this.destroy(this.form);

		// Clear subscriptions
		this.destroy$.next(true);
		this.destroy$.complete();
	}

	handleADRBodyTypeChange() {
		this.form.controls.techRecord_adrDetails_vehicleDetails_type.valueChanges
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				// When the ADR body type is a tank or battery, remove the explosives type 2 and 3 from the permitted dangerous goods list
				if (this.adrService.canDisplayTankOrBatterySection(this.form.getRawValue() as any)) {
					this.form.patchValue({
						techRecord_adrDetails_permittedDangerousGoods:
							this.form.controls.techRecord_adrDetails_permittedDangerousGoods.value?.filter((good) => {
								return good !== ADRDangerousGood.EXPLOSIVES_TYPE_2 && good !== ADRDangerousGood.EXPLOSIVES_TYPE_3;
							}),
						techRecord_adrDetails_compatibilityGroupJ: null,
						techRecord_adrDetails_bodyDeclaration_type: null,
					});

					this.permittedDangerousGoodsOptions = PERMITTED_DANGEROUS_GOODS_OPTIONS.filter(({ value }) => {
						return value !== ADRDangerousGood.EXPLOSIVES_TYPE_2 && value !== ADRDangerousGood.EXPLOSIVES_TYPE_3;
					});
				} else {
					this.permittedDangerousGoodsOptions = PERMITTED_DANGEROUS_GOODS_OPTIONS;
				}
			});
	}

	get canDisplayDangerousGoodsWarning() {
		if (this.mode() !== Modes.EDIT) return null;

		const originalDangerousGoodsValue = (this.store.selectSignal(techRecord)() as TechRecordType<'hgv' | 'lgv' | 'trl'>)
			?.techRecord_adrDetails_dangerousGoods;
		const dangerousGoods = this.form.get('techRecord_adrDetails_dangerousGoods');

		const valueHasChanged = originalDangerousGoodsValue !== dangerousGoods?.value;

		return dangerousGoods?.value === false && dangerousGoods.dirty && valueHasChanged
			? 'By selecting this field it will delete all previous ADR field inputs'
			: null;
	}

	getEditAdditionalExaminerNotePage(examinerNoteIndex: number) {
		const reason = this.route.snapshot.data['reason'];
		const route = `../${reason}/edit-additional-examiner-note/${examinerNoteIndex}`;

		this.store.dispatch(updateScrollPosition({ position: this.viewportScroller.getScrollPosition() }));
		this.router.navigate([route], { relativeTo: this.route, state: this.techRecord });
	}

	getADRExaminerNotes() {
		return this.form.get('techRecord_adrDetails_additionalExaminerNotes') as FormArray;
	}

	handleInitialiseUNNumbers() {
		const unNumbers = this.techRecord()?.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo;

		// If there are un numbers, then prepopulate them
		if (Array.isArray(unNumbers) && unNumbers.length > 0) {
			unNumbers?.forEach((number, index) => {
				this.form.controls.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo.push(
					this.fb.control<string | null>(number, [
						...(index === 0
							? [
									this.adrValidators.requiresAUnNumberOrReferenceNumber(
										'Reference number or UN number 1 is required when selecting Product list'
									),
								]
							: []),
						this.commonValidators.maxLength(1500, () => ({
							error: `UN number ${index + 1} must be less than or equal to 1500 characters`,
							anchorLink: `techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo-${index + 1}`,
							accordion: 'adr',
						})),
					])
				);
			});
		}

		// Otherwise, add a single empty UN number
		else {
			this.form.controls.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo.push(
				this.fb.control<string | null>(null, [
					this.adrValidators.requiresAUnNumberOrReferenceNumber(
						'Reference number or UN number 1 is required when selecting Product list'
					),
					this.commonValidators.maxLength(1500, () => ({
						error: 'UN number 1 must be less than or equal to 1500 characters',
						anchorLink: 'techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo-1',
						accordion: 'adr',
					})),
				])
			);
		}
	}

	addUNNumber() {
		const arr = this.form.controls.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo;
		const allNumbersPopulated = arr.value.every((value: string | null) => !!value);

		if (allNumbersPopulated) {
			arr.push(
				this.fb.control<string | null>(null, [
					this.commonValidators.maxLength(1500, (control) => {
						const index = _.indexOf(arr.controls, control);
						return {
							error: `UN number ${index + 1} must be less than or equal to 1500 characters`,
							anchorLink: `techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo-${index + 1}`,
							accordion: 'adr',
						};
					}),
				])
			);
		}

		arr.markAsTouched();
		arr.updateValueAndValidity();
	}

	removeUNNumber(index: number) {
		this.form.controls.techRecord_adrDetails_tank_tankDetails_tankStatement_productListUnNo.removeAt(index);
		this.store.dispatch(removeUNNumber({ index }));
	}

	handleInitialiseSubsequentTankInspections() {
		this.techRecord()?.techRecord_adrDetails_tank_tankDetails_tc3Details?.forEach(() => this.addTC3TankInspection());
	}

	addTC3TankInspection() {
		this.form.controls.techRecord_adrDetails_tank_tankDetails_tc3Details.push(
			this.fb.group({
				tc3Type: this.fb.control<string | null>(null, [
					this.adrValidators.requiresOnePopulatedTC3Field(
						'TC3: Subsequent inspection must have at least one populated field'
					),
				]),
				tc3PeriodicNumber: this.fb.control<string | null>(null, [
					this.commonValidators.applyWhen(
						(control) => this.adrService.canDisplayTankOrBatterySection(control.root.getRawValue()),
						this.commonValidators.maxLength(75, (control) => {
							const formArray = control.parent?.parent as FormArray;
							const index = formArray.controls.indexOf(control.parent as FormGroup);
							return {
								error: 'TC3: Certificate Number must be less than or equal to 75 characters',
								anchorLink: `techRecord_adrDetails_tank_tankDetails_tc3Details_${index}_tc3PeriodicNumber`,
								accordion: 'adr',
							};
						})
					),
					this.adrValidators.requiresOnePopulatedTC3Field(
						'TC3: Subsequent inspection must have at least one populated field'
					),
				]),
				tc3PeriodicExpiryDate: this.fb.control<string | null>(null, [
					this.commonValidators.applyWhen(
						(control) => this.adrService.canDisplayTankOrBatterySection(control.root.getRawValue()),
						this.commonValidators.date(
							'TC3: Expiry date',
							(control) => {
								const formArray = control.parent?.parent as FormArray;
								const index = formArray.controls.indexOf(control.parent as FormGroup);
								return `techRecord_adrDetails_tank_tankDetails_tc3Details_${index}_tc3PeriodicExpiryDate`;
							},
							'adr'
						)
					),
					this.adrValidators.requiresOnePopulatedTC3Field(
						'TC3: Subsequent inspection must have at least one populated field'
					),
				]),
			})
		);
	}

	removeTC3TankInspection(index: number) {
		this.form.controls.techRecord_adrDetails_tank_tankDetails_tc3Details.removeAt(index);
		this.store.dispatch(removeTC3TankInspection({ index }));
	}

	protected readonly YES_NO_OPTIONS = YES_NO_OPTIONS;
	protected readonly FormNodeWidth = FormNodeWidth;
	protected readonly ADR_TANK_STATEMENT_SUBSTANCES_PERMITTED = ADR_TANK_STATEMENT_SUBSTANCES_PERMITTED;
	protected readonly Modes = Modes;
}
