import { AdrService } from '@/src/app/services/adr/adr.service';
import { techRecord } from '@/src/app/store/technical-records/technical-record-service.selectors';
import { AsyncPipe, DatePipe, ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { ToUppercaseDirective } from '@directives/app-to-uppercase/app-to-uppercase.directive';
import { ADRAdditionalNotesNumber } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrAdditionalNotesNumber.enum.js';
import { ADRBodyDeclarationTypes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyDeclarationType.enum.js';
import { ADRBodyType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrBodyType.enum.js';
import { ADRCompatibilityGroupJ } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrCompatibilityGroupJ.enum.js';
import { ADRDangerousGood } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/adrDangerousGood.enum.js';
import { TC3Types } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/tc3Types.enum.js';
import { AdditionalExaminerNotes } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { GovukCheckboxGroupComponent } from '@forms/components/govuk-checkbox-group/govuk-checkbox-group.component';
import { GovukFormGroupAutocompleteComponent } from '@forms/components/govuk-form-group-autocomplete/govuk-form-group-autocomplete.component';
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
import { YES_NO_OPTIONS } from '@models/options.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { removeTC3TankInspection, updateScrollPosition } from '@store/technical-records';
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
		AsyncPipe,
		GovukFormGroupSelectComponent,
		GovukFormGroupRadioComponent,
		ToUppercaseDirective,
		GovukCheckboxGroupComponent,
		GovukFormGroupAutocompleteComponent,
		RadioComponent,
		DatePipe,
		DefaultNullOrEmpty,
		GovukFormGroupCheckboxComponent,
		GovukFormGroupTextareaComponent,
		PaginationComponent,
	],
})
export class AdrComponent extends EditBaseComponent implements OnInit, OnDestroy {
	validators = inject(CommonValidatorsService);
	adrService = inject(AdrService);
	adrValidators = inject(AdrValidatorsService);
	router = inject(Router);
	route = inject(ActivatedRoute);
	viewportScroller = inject(ViewportScroller);

	// TODO properly type this at some point
	form = this.fb.group({
		techRecord_adrDetails_dangerousGoods: this.fb.control<boolean>(false),
		// Applicant Details
		techRecord_adrDetails_applicantDetails_name: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(150, 'Name must be less than or equal to 150 characters'),
		]),
		techRecord_adrDetails_applicantDetails_street: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(150, 'Address line 1 must be less than or equal to 150 characters'),
		]),
		techRecord_adrDetails_applicantDetails_town: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(100, 'Address line 2 (optional) must be less than or equal to 100 characters'),
		]),
		techRecord_adrDetails_applicantDetails_city: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(100, 'Town or city must be less than or equal to 100 characters'),
		]),
		techRecord_adrDetails_applicantDetails_postcode: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(25, 'Postcode must be less than or equal to 25 characters'),
		]),
		// ADR Details
		techRecord_adrDetails_vehicleDetails_type: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithDangerousGoods('ADR body type is required with Approved to carry dangerous goods'),
		]),
		techRecord_adrDetails_vehicleDetails_usedOnInternationalJourneys: this.fb.control<string | null>(null),
		techRecord_adrDetails_vehicleDetails_approvalDate: this.fb.control<string | null>(null, [
			this.commonValidators.date('Date processed'),
			this.commonValidators.pastDate('Date processed must be in the past'),
			this.adrValidators.requiredWithDangerousGoods(
				'Date processed is required with Approved to carry dangerous goods'
			),
		]),
		techRecord_adrDetails_permittedDangerousGoods: this.fb.control<string[] | null>(
			[],
			[
				this.adrValidators.requiredWithDangerousGoods(
					'Permitted dangerous goods is required with Approved to carry dangerous goods'
				),
			]
		),
		techRecord_adrDetails_bodyDeclaration_type: this.fb.control<string | undefined>(undefined, []),
		techRecord_adrDetails_compatibilityGroupJ: this.fb.control<boolean | null>(null, [
			this.adrValidators.requiredWithExplosives('Compatibility group J is required with Permitted dangerous goods'),
		]),
		techRecord_adrDetails_additionalNotes_number: this.fb.control<string[]>(
			[],
			[
				this.adrValidators.requiredWithDangerousGoods(
					'Guidance notes is required with Approved to carry dangerous goods'
				),
			]
		),
		techRecord_adrDetails_adrTypeApprovalNo: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(40, 'ADR type approval number must be less than or equal to 40 characters'),
		]),
		techRecord_adrDetails_declarationsSeen: this.fb.control<boolean>(false),
		techRecord_adrDetails_brakeDeclarationsSeen: this.fb.control<boolean>(false),
		techRecord_adrDetails_brakeDeclarationIssuer: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(500, 'Issuer must be less than or equal to 500 characters'),
		]),
		techRecord_adrDetails_brakeEndurance: this.fb.control<boolean>(false),
		techRecord_adrDetails_weight: this.fb.control<number | null>(null, [
			this.commonValidators.max(99999999, 'Weight (tonnes) must be less than or equal to 99999999'),
			this.adrValidators.requiredWithBrakeEndurance('Weight (tonnes) is required'),
			this.commonValidators.pattern('^\\d*(\\.\\d{0,2})?$', 'Weight (tonnes) Max 2 decimal places'),
		]),
		techRecord_adrDetails_newCertificateRequested: this.fb.control<boolean>(false),
		techRecord_adrDetails_additionalExaminerNotes: this.fb.control<AdditionalExaminerNotes[] | null>(null),
		techRecord_adrDetails_additionalExaminerNotes_note: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(1024, 'Additional Examiner Notes must be less than or equal to 1024 characters'),
		]),
		techRecord_adrDetails_adrCertificateNotes: this.fb.control<string | null>(null, [
			this.commonValidators.maxLength(1500, 'ADR Certificate Notes must be less than or equal to 1500 characters'),
		]),
		// Tank Details > Tank Inspections
		techRecord_adrDetails_tank_tankDetails_tc2Details_tc2Type: this.fb.control<string | null>('initial'),
		techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateApprovalNo: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithTankOrBattery('TC2: Certificate number is required with ADR body type'),
			this.commonValidators.maxLength(70, 'TC2: Certificate Number must be less than or equal to 70 characters'),
		]),
		techRecord_adrDetails_tank_tankDetails_tc2Details_tc2IntermediateExpiryDate: this.fb.control<string | null>(null, [
			this.commonValidators.date('TC2: Expiry date'),
			this.adrValidators.requiredWithTankOrBattery('TC2: Expiry date is required with ADR body type'),
		]),
		techRecord_adrDetails_tank_tankDetails_tc3Details: this.fb.array<FormGroup>([]),

		// Miscellaneous
		techRecord_adrDetails_memosApply: this.fb.control<string | null>(null),
		techRecord_adrDetails_m145Statement: this.fb.control<boolean>(false),

		// Battery List
		techRecord_adrDetails_listStatementApplicable: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithBattery('Battery list applicable is required with ADR body type', true),
		]),
		techRecord_adrDetails_batteryListNumber: this.fb.control<string | null>(null, [
			this.adrValidators.requiredWithBatteryListApplicable('Reference number is required with Battery list applicable'),
			this.commonValidators.maxLength(8, 'Reference number must be less than or equal to 8 characters'),
		]),
	});

	adrBodyTypesOptions = getOptionsFromEnum(ADRBodyType);

	memosApplyOptions = [{ value: '07/09 3mth leak ext ', label: 'Yes' }];

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

	tc3InspectionOptions = getOptionsFromEnum(TC3Types);

	bodyDeclarationOptions = getOptionsFromEnum(ADRBodyDeclarationTypes);

	destroy$ = new ReplaySubject<boolean>(1);
	techRecord = input.required<TechRecordType<'hgv' | 'lgv' | 'trl'>>();

	ngOnInit(): void {
		this.handleInitialiseSubsequentTankInspections();

		// Attach all form controls to parent
		this.init(this.form);

		this.handleADRBodyTypeChange();
	}

	getVehicleType(): VehicleTypes {
		return this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord());
	}

	shouldDisplayFormControl(formControlName: string) {
		return !!this.form.get(formControlName);
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
				const options = getOptionsFromEnum(ADRDangerousGood);

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

					this.permittedDangerousGoodsOptions = options.filter(({ value }) => {
						return value !== ADRDangerousGood.EXPLOSIVES_TYPE_2 && value !== ADRDangerousGood.EXPLOSIVES_TYPE_3;
					});
				} else {
					this.permittedDangerousGoodsOptions = options;
				}
			});
	}

	get canDisplayDangerousGoodsWarning() {
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

	handleInitialiseSubsequentTankInspections() {
		this.techRecord()?.techRecord_adrDetails_tank_tankDetails_tc3Details?.forEach(() => this.addTC3TankInspection());
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
					this.commonValidators.date('TC3: Expiry date'),
					this.adrValidators.requiresOnePopulatedTC3Field(
						'TC3 Subsequent inspection must have at least one populated field'
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
}
