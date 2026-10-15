import { CommonValidatorsService } from '@/src/app/forms/validators/common-validators.service';
import { MultiOptions } from '@/src/app/models/options.model';
import { LoadStatusService } from '@/src/app/services/load-status/load-status.service';
import { MultiOptionsService } from '@/src/app/services/multi-options/multi-options.service';
import { TestTypeService } from '@/src/app/services/test-type/test-type.service';
import { TestService } from '@/src/app/services/test/test.service';
import { selectAllReferenceDataByResourceType } from '@/src/app/store/reference-data';
import { techRecord } from '@/src/app/store/technical-records';
import { toEditOrNotToEdit } from '@/src/app/store/test-records';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum.js';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { UnladenBodyType } from '@dvsa/cvs-type-definitions/types/v1/enums/unladenBodyType.enum.js';
import { VehicleLoadStatusType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleLoadStatus.enum.js';
import { Modes } from '@models/modes.enum';
import { TEST_TYPES_GROUP7, TEST_TYPES_GROUP9_10_CENTRAL_DOCS } from '@models/testTypeId.enum';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { TestAmendComponent } from './test-amend/test-amend.component';
import { TestCreateComponent } from './test-create/test-create.component';
import { TestViewComponent } from './test-view/test-view.component';

@Component({
	selector: 'app-test',
	templateUrl: './test.component.html',
	imports: [FormsModule, ReactiveFormsModule, TestViewComponent, TestCreateComponent, TestAmendComponent],
	styleUrls: ['./test.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestComponent implements OnInit, OnDestroy {
	store = inject(Store);
	testService = inject(TestService);
	testTypeService = inject(TestTypeService);
	techRecordService = inject(TechnicalRecordService);
	optionsService = inject(MultiOptionsService);
	commonValidators = inject(CommonValidatorsService);
	loadStatusService = inject(LoadStatusService);

	mode = input.required<Modes>();
	initialMode = input.required<Modes>();

	form = this.testService.form;
	testResult = this.store.selectSignal(toEditOrNotToEdit);
	techRecord = this.store.selectSignal(techRecord);
	abandonReasons = computed(() => this.getAbandonReasonsList());
	destroy = new ReplaySubject<boolean>(1);

	readonly Modes = Modes;
	readonly TestResults = TestResults;

	ngOnInit(): void {
		this.prepopulateVTG15Required();
		this.loadOptions();
		this.addValidators();
		this.disableFields();
		this.handleTestStartTimestampChange();
		this.handleTestEndTimestampChange();
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}

	prepopulateVTG15Required(): void {
		if (this.initialMode() !== Modes.EDIT && this.initialMode() !== Modes.CREATE) return;

		const vtg15Required = this.form.controls.vtg15.controls.vtg15Required;
		if (vtg15Required.value != null) return;

		const techRecord = this.techRecord();
		if (
			techRecord?.techRecord_vehicleType === 'hgv' ||
			techRecord?.techRecord_vehicleType === 'lgv' ||
			techRecord?.techRecord_vehicleType === 'trl'
		) {
			vtg15Required.setValue(techRecord.techRecord_adrDetails_dangerousGoods ? null : false);
		}
	}

	getAbandonReasonsList(): MultiOptions {
		const testResult = this.testResult();
		if (!testResult) return [];

		const resourceType = this.testTypeService.getAbandonReasonsResourceType(testResult);
		const referenceData = this.store.selectSignal(selectAllReferenceDataByResourceType(resourceType))() || [];
		return referenceData.map((reason) => ({ label: `${reason.description}`, value: `${reason.description}` }));
	}

	loadOptions(): void {
		const testResult = this.testResult();
		if (!testResult) return;
		this.optionsService.loadOptions(this.testTypeService.getAbandonReasonsResourceType(testResult));
	}

	addValidators(): void {
		const testTypeGroup = this.form.controls.testTypes.at(0);

		this.form.controls.contingencyTestNumber.setValidators([
			this.commonValidators.applyWhen(
				() => this.contingencyTestNumberIsRequired(),
				this.commonValidators.required('Contingency Test Number')
			),
			this.commonValidators.minLength(6, 'Contingency Test Number'),
			this.commonValidators.maxLength(8, 'Contingency Test Number'),
		]);

		testTypeGroup.controls.prohibitionIssued.setValidators([
			this.commonValidators.applyWhen(
				() => this.shouldShowProhibitionIssued(),
				this.commonValidators.required('Prohibition Issued')
			),
		]);

		testTypeGroup.controls.certificateNumber.setValidators([
			this.commonValidators.applyWhen(
				() =>
					this.shouldShowCertificateNumber() &&
					this.testResult()?.testTypes[0].testResult !== null &&
					this.mode() !== Modes.ABANDON,
				this.commonValidators.requiredWith('Certificate Number', 'Result')
			),
			this.commonValidators.alphanumeric('Certificate Number'),
		]);

		testTypeGroup.controls.testExpiryDate.setValidators([
			this.commonValidators.applyWhen(
				() =>
					(this.mode() === Modes.AMEND && testTypeGroup.controls.testResult.value === TestResults.PASS) ||
					this.shouldShowExpiryDate(),
				this.commonValidators.required('Expiry Date')
			),
			this.commonValidators.date('Expiry Date'),
			this.commonValidators.isAfterDate('testTypeStartTimestamp', 'Expiry Date', 'Start Time'),
			this.commonValidators.applyWhen(
				() => this.isTestTypeGroup7() && this.mode() === Modes.CREATE,
				this.commonValidators.futureDate('Expiry Date')
			),
		]);

		testTypeGroup.controls.testAnniversaryDate.setValidators([
			this.commonValidators.applyWhen(
				() => this.mode() === Modes.AMEND && testTypeGroup.controls.testResult.value === TestResults.PASS,
				this.commonValidators.required('Anniversary date')
			),
			this.commonValidators.date('Anniversary date'),
			this.commonValidators.isAfterDate('testTypeStartTimestamp', 'Anniversary date', 'Start Time'),
		]);

		testTypeGroup.controls.testTypeStartTimestamp.setValidators([
			this.commonValidators.required('Test start date and time'),
			this.commonValidators.datetime({ label: 'Test start date and time' }),
			this.commonValidators.pastDate('Test start date and time'),
		]);

		testTypeGroup.controls.testTypeEndTimestamp.setValidators([
			this.commonValidators.required('Test end date and time'),
			this.commonValidators.datetime({ label: 'Test end date and time' }),
			this.commonValidators.pastDate('Test end date and time'),
			this.commonValidators.isAfterDate('testTypeStartTimestamp', 'Test end date and time', 'Test start date and time'),
		]);

		const loadStatusGroup = testTypeGroup.controls.loadStatus;
		loadStatusGroup.controls.vehicleLoadStatus.setValidators([
			this.commonValidators.applyWhen(() => this.isLoadStatusRequired(), this.commonValidators.required('Load status')),
		]);
		loadStatusGroup.controls.unladenBodyType.setValidators([
			this.commonValidators.applyWhen(() => this.isUnladenSelected(), this.commonValidators.required('Body type')),
		]);
		loadStatusGroup.controls.otherUnladenBodyType.setValidators([
			this.commonValidators.applyWhen(
				() => this.isOtherUnladenBodyTypeRequired(),
				this.commonValidators.required('Enter body type'),
				this.commonValidators.maxLength(200, 'Enter body type')
			),
		]);
		loadStatusGroup.controls.reasonForNotLoading.setValidators([
			this.commonValidators.applyWhen(
				() => this.isUnladenSelected(),
				this.commonValidators.required('Reason for not loading')
			),
		]);
		loadStatusGroup.controls.partiallyLadenReason.setValidators([
			this.commonValidators.applyWhen(
				() => this.isPartiallyLadenSelected(),
				this.commonValidators.required('Partially laden reason'),
				this.commonValidators.maxLength(200, 'Partially laden reason')
			),
		]);
		loadStatusGroup.controls.otherReasonForNotLoading.setValidators([
			this.commonValidators.applyWhen(
				() => this.isOtherReasonForNotLoadingRequired(),
				this.commonValidators.required('Enter reason for not loading'),
				this.commonValidators.maxLength(200, 'Enter reason for not loading')
			),
		]);
		testTypeGroup.controls.additionalCommentsForAbandon.setValidators([
			this.commonValidators.applyWhen(
				() => this.mode() === Modes.AMEND && this.testResult()?.testTypes[0].testResult === TestResults.ABANDONED,
				this.commonValidators.requiredWith('Additional details for abandoning', 'Result')
			),
		]);
	}

	disableFields(): void {
		// Initially enable all controls
		this.form.enable();

		if (this.initialMode() === Modes.AMEND) {
			this.form.controls.testTypes.at(0).controls.createdAt.disable();
			this.form.controls.testTypes.at(0).controls.testCode.disable();
			this.form.controls.testTypes.at(0).controls.testTypeName.disable();
			this.form.controls.testTypes.at(0).controls.testNumber.disable();
			this.form.controls.testTypes.at(0).controls.testTypeEndTimestamp.disable();
			this.form.controls.testTypes.at(0).controls.testTypeStartTimestamp.disable();
		}

		if (TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '')) {
			this.form.controls.testTypes.at(0).controls.testTypeName.disable();
		}
	}

	contingencyTestNumberIsRequired(): boolean {
		return this.initialMode() === Modes.EDIT;
	}

	handleTestStartTimestampChange(): void {
		this.form.controls.testTypes
			.at(0)
			.controls.testTypeStartTimestamp.valueChanges.pipe(takeUntil(this.destroy))
			.subscribe((value) => {
				// Hoist value to top level of form
				this.form.patchValue({ testStartTimestamp: value || undefined });
			});
	}

	handleTestEndTimestampChange(): void {
		this.form.controls.testTypes
			.at(0)
			.controls.testTypeEndTimestamp.valueChanges.pipe(takeUntil(this.destroy))
			.subscribe((value) => {
				// Hoist value to top level of form
				this.form.patchValue({ testEndTimestamp: value || undefined });
			});
	}

	isTestTypeGroup7(): boolean {
		return TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '');
	}

	shouldShowResult(): boolean {
		return this.isTestTypeGroup7();
	}

	shouldShowExpiryDate(): boolean {
		const isGroup7 = TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '');
		if (this.testResult()?.testTypes[0].testResult === TestResults.ABANDONED) return false;
		if (this.mode() === Modes.ABANDON) return false;
		if (!isGroup7) return false;
		if (this.testResult()?.testTypes[0].testResult === 'fail') return false;
		return true;
	}

	getAbandonNotesLabel(): string {
		if (this.isTestTypeGroup7()) {
			return 'Additional notes as to why this test was abandoned';
		}
		return 'Additional notes as to why this test was abandoned (optional)';
	}

	shouldShowCreateModeDescription(): boolean {
		return this.isTestTypeGroup7() && this.mode() === Modes.CREATE;
	}

	shouldShowAnniversaryDate(): boolean {
		return !this.isTestTypeGroup7();
	}

	shouldShowCentralDocs(): boolean {
		return (
			[...TEST_TYPES_GROUP9_10_CENTRAL_DOCS, ...TEST_TYPES_GROUP7].includes(
				this.testResult()?.testTypes[0].testTypeId ?? ''
			) && this.testResult()?.testTypes[0].testResult !== 'fail'
		);
	}

	shouldShowGenerateADRCertificate(): boolean {
		if (this.mode() === Modes.AMEND) {
			return false;
		}
		return (
			TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '') &&
			this.testResult()?.testTypes[0].testResult === 'pass'
		);
	}

	shouldShowCertificateNumber(): boolean {
		if (!this.isTestTypeGroup7()) return false;
		if (this.testResult()?.testTypes[0].testResult == 'fail') {
			return false;
		}
		return !(
			this.testResult()?.testTypes[0].testResult == 'pass' && this.testResult()?.testTypes[0].centralDocs?.issueRequired
		);
	}

	shouldShowProhibitionIssued(): boolean {
		return this.isTestTypeGroup7();
	}

	shouldShowLoadStatus(): boolean {
		return this.loadStatusService.isLoadStatusApplicable(this.testResult());
	}

	isLoadStatusRequired(): boolean {
		// When amending a test, load status is displayed but can be left blank
		return this.shouldShowLoadStatus() && this.initialMode() !== Modes.AMEND;
	}

	isUnladenSelected(): boolean {
		const vehicleLoadStatus = this.form.get('testTypes.0.loadStatus.vehicleLoadStatus')?.getRawValue();
		return vehicleLoadStatus === VehicleLoadStatusType.UNLADEN;
	}

	isPartiallyLadenSelected(): boolean {
		const vehicleLoadStatus = this.form.get('testTypes.0.loadStatus.vehicleLoadStatus')?.getRawValue();
		return vehicleLoadStatus === VehicleLoadStatusType.PARTIALLY_LADEN;
	}

	isOtherUnladenBodyTypeRequired(): boolean {
		if (!this.isUnladenSelected()) return false;

		const unladenBodyType = this.form.get('testTypes.0.loadStatus.unladenBodyType')?.getRawValue();
		return unladenBodyType === UnladenBodyType.OTHER;
	}

	isOtherReasonForNotLoadingRequired(): boolean {
		if (!this.isUnladenSelected()) return false;

		const reasonForNotLoading = this.form.get('testTypes.0.loadStatus.reasonForNotLoading')?.getRawValue();
		return reasonForNotLoading === ReasonForNotLoading.OTHER;
	}
}
