import { Injectable, computed, inject, signal } from '@angular/core';
import {
	FieldContext,
	FieldTree,
	MAX_LENGTH,
	PathKind,
	SchemaPath,
	SchemaPathRules,
	applyEach,
	disabled,
	hidden,
	maxError,
	maxLength,
	maxLengthError,
	metadata,
	minLengthError,
	patternError,
	required,
	requiredError,
	schema,
	form as signalForm,
	validate,
} from '@angular/forms/signals';
import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { UnladenBodyType } from '@dvsa/cvs-type-definitions/types/v1/enums/unladenBodyType.enum';
import { VehicleLoadStatusType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleLoadStatus.enum';
import { TestResultSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { EUVehicleCategory as TechRecordEUCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { dateError, dateTimeError } from '@forms/validators/date-time-error';
import {
	TEST_TYPES_GROUP1,
	TEST_TYPES_GROUP1_DESK_BASED_TEST,
	TEST_TYPES_GROUP1_SPEC_TEST,
	TEST_TYPES_GROUP2,
	TEST_TYPES_GROUP2_DESK_BASED_TEST,
	TEST_TYPES_GROUP2_SPEC_TEST,
	TEST_TYPES_GROUP3_4_8,
	TEST_TYPES_GROUP3_DESK_BASED_TEST,
	TEST_TYPES_GROUP3_SPEC_TEST,
	TEST_TYPES_GROUP4_DESK_BASED_TEST,
	TEST_TYPES_GROUP4_SPEC_TEST,
	TEST_TYPES_GROUP5_13,
	TEST_TYPES_GROUP5_DESK_BASED_TEST,
	TEST_TYPES_GROUP5_SPEC_TEST,
	TEST_TYPES_GROUP7,
	TEST_TYPES_GROUP9_10,
	TEST_TYPES_GROUP9_10_CENTRAL_DOCS,
	TEST_TYPES_GROUP12_14,
	TEST_TYPES_GROUP15_16,
} from '@models/testTypeId.enum';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { LoadStatusService } from '@services/load-status/load-status.service';
import { isAdrVehicle } from '@services/technical-record/technical-record.service';
import { techRecord } from '@store/technical-records';
import { isTestTypeOldIvaOrMsva, toEditOrNotToEdit } from '@store/test-records';
import dayjs from 'dayjs';
import { Modes } from '../../models/modes.enum';
import {
	CustomDefectFormModel,
	TestResultFormModel,
	TestTypeFormModel,
	createInitialTestResultFormModel,
	patchTestResultFormModel,
	toTestResult,
} from './test-result-form.model';

@Injectable({
	providedIn: 'root',
})
export class TestService {
	readonly store = inject(Store);
	readonly loadStatusService = inject(LoadStatusService);

	readonly mode = signal<Modes | null>(null);
	readonly initialMode = signal<Modes | null>(null);

	readonly isEditing = computed(() => this.mode() === Modes.EDIT || this.mode() === Modes.AMEND);
	readonly isAbandoning = signal(false);

	readonly isViewFlow = computed(() => this.initialMode() === Modes.VIEW);
	readonly isAmendFlow = computed(() => this.initialMode() === Modes.AMEND);
	readonly isCreateFlow = computed(() => this.initialMode() === Modes.EDIT);

	readonly techRecord = this.store.selectSignal(techRecord);
	readonly testResult = this.store.selectSignal(toEditOrNotToEdit);
	readonly oldSpecialist = this.store.selectSignal(isTestTypeOldIvaOrMsva);

	// Compute test outcomes
	readonly isPass = computed(() => this.testResult()?.testTypes[0]?.testResult === TestResults.PASS);
	readonly isFail = computed(() => this.testResult()?.testTypes[0]?.testResult === TestResults.FAIL);
	readonly isAbandon = computed(() => this.testResult()?.testTypes[0]?.testResult === TestResults.ABANDONED);
	readonly isPrs = computed(() => this.testResult()?.testTypes[0]?.testResult === TestResults.PRS);
	readonly isPassOrPrs = computed(() => this.isPass() || this.isPrs());

	// Compute vehicle type
	readonly isHgv = computed(() => this.testResult()?.vehicleType === VehicleTypes.HGV);
	readonly isPsv = computed(() => this.testResult()?.vehicleType === VehicleTypes.PSV);
	readonly isCar = computed(() => this.testResult()?.vehicleType === VehicleTypes.CAR);
	readonly isLgv = computed(() => this.testResult()?.vehicleType === VehicleTypes.LGV);
	readonly isTrl = computed(() => this.testResult()?.vehicleType === VehicleTypes.TRL);
	readonly isMotorcycle = computed(() => this.testResult()?.vehicleType === VehicleTypes.MOTORCYCLE);
	readonly isHeavyTrl = computed(() => this.isTrl() && !this.isSmallTrl());
	readonly isSmallTrl = computed(
		() =>
			this.isTrl() &&
			(this.testResult()?.euVehicleCategory === TechRecordEUCategory.O1 ||
				this.testResult()?.euVehicleCategory === TechRecordEUCategory.O2)
	);
	readonly isHeavyVehicle = computed(() => this.isHgv() || this.isPsv() || this.isTrl());

	// Compute is membership of the test type groups
	readonly testTypeId = computed(() => this.testResult()?.testTypes?.[0]?.testTypeId ?? '');

	readonly isGroup3And4And8 = computed(() => TEST_TYPES_GROUP3_4_8.includes(this.testTypeId()));
	readonly isGroup5or13 = computed(() => TEST_TYPES_GROUP5_13.includes(this.testTypeId()));
	readonly isGroup7 = computed(() => TEST_TYPES_GROUP7.includes(this.testTypeId()));
	readonly isGroup9And10 = computed(() => TEST_TYPES_GROUP9_10.includes(this.testTypeId()));
	readonly isGroup9And10CentralDocs = computed(() => TEST_TYPES_GROUP9_10_CENTRAL_DOCS.includes(this.testTypeId()));
	readonly isGroup12or14 = computed(() => TEST_TYPES_GROUP12_14.includes(this.testTypeId()));
	readonly isGroup15And16 = computed(() => TEST_TYPES_GROUP15_16.includes(this.testTypeId()));
	readonly isSpecialistGroup1 = computed(() => TEST_TYPES_GROUP1_SPEC_TEST.includes(this.testTypeId()));
	readonly isSpecialistGroup2 = computed(() => TEST_TYPES_GROUP2_SPEC_TEST.includes(this.testTypeId()));
	readonly isSpecialistGroup3 = computed(() => TEST_TYPES_GROUP3_SPEC_TEST.includes(this.testTypeId()));
	readonly isSpecialistGroup4 = computed(() => TEST_TYPES_GROUP4_SPEC_TEST.includes(this.testTypeId()));
	readonly isSpecialistGroup5 = computed(() => TEST_TYPES_GROUP5_SPEC_TEST.includes(this.testTypeId()));
	readonly isDeskBasedGroup1 = computed(() => TEST_TYPES_GROUP1_DESK_BASED_TEST.includes(this.testTypeId()));
	readonly isDeskBasedGroup2 = computed(() => TEST_TYPES_GROUP2_DESK_BASED_TEST.includes(this.testTypeId()));
	readonly isDeskBasedGroup3 = computed(() => TEST_TYPES_GROUP3_DESK_BASED_TEST.includes(this.testTypeId()));
	readonly isDeskBasedGroup4 = computed(() => TEST_TYPES_GROUP4_DESK_BASED_TEST.includes(this.testTypeId()));
	readonly isDeskBasedGroup5 = computed(() => TEST_TYPES_GROUP5_DESK_BASED_TEST.includes(this.testTypeId()));

	readonly showResult = computed(
		() => this.isGroup7() || this.isSpecialistGroup1() || this.isGroup5or13() || this.isGroup3And4And8()
	);
	// These templates record no expiry or anniversary date in any mode.
	readonly withoutTestDates = computed(
		() => this.isSpecialistGroup1() || this.isGroup5or13() || this.isGroup3And4And8()
	);
	readonly additionalNotesLabel = computed(() =>
		this.isGroup7() ? 'Additional Notes' : 'Additional Notes (optional)'
	);
	readonly requireOdometerPair = computed(() => !this.isAbandoning() && !this.isAbandon());
	readonly issueDocsCentrally = computed(() => this.testResult()?.testTypes?.[0]?.centralDocs?.issueRequired === true);
	readonly certificateNumberRules = computed(() => {
		const result = this.testResult();
		const test = result?.testTypes?.[0];
		const notApplicable = { visible: false, required: false, requiredWithResult: false };
		if (!test?.testTypeId || !result?.vehicleType) return notApplicable;

		const mode = this.mode();
		const journey = this.initialMode();
		const amending = mode === Modes.AMEND || mode === Modes.VIEW || journey === Modes.AMEND || journey === Modes.VIEW;
		const optional = { ...notApplicable, visible: true };

		if ((this.isHgv() || this.isTrl()) && this.isGroup7()) {
			// ADR amendments can retain a manually entered number for PRS or abandoned tests.
			const visible = amending
				? this.isAbandon() || (this.isPassOrPrs() && !this.issueDocsCentrally())
				: this.isPass() && !this.issueDocsCentrally();
			return { ...optional, visible, requiredWithResult: this.isPass() && !this.issueDocsCentrally() };
		}

		if ((this.isHgv() || this.isTrl()) && !amending && this.isGroup5or13()) {
			const visible = this.isPass() && !this.issueDocsCentrally();
			return { ...optional, visible, requiredWithResult: visible };
		}

		if ((this.isPsv() || this.isHgv()) && this.isGroup15And16()) {
			return { ...optional, visible: !(amending && this.isPassOrPrs() && this.issueDocsCentrally()), required: true };
		}

		if (this.isSpecialistGroup1()) {
			if (amending && this.oldSpecialist()) return optional;
			if (this.isHgv() || this.isTrl()) {
				return { ...optional, visible: !this.isFail(), requiredWithResult: this.isPassOrPrs() };
			}

			return {
				...optional,
				visible: !this.isFail() && !(this.isPassOrPrs() && this.issueDocsCentrally()),
				requiredWithResult: this.isPass() && !this.issueDocsCentrally(),
			};
		}

		if (!this.isSmallTrl() && this.isSpecialistGroup5()) {
			if (amending && this.oldSpecialist()) return notApplicable;
			return { ...optional, visible: !this.isFail(), requiredWithResult: this.isPassOrPrs() };
		}

		if (this.isPsv() && this.isDeskBasedGroup1()) {
			// New PSV desk-based group 1 tests default to Pass before the result is populated.
			return { ...optional, requiredWithResult: this.isPass() || (!amending && test.testResult === undefined) };
		}

		if (this.isHeavyVehicle() && this.isDeskBasedGroup2()) {
			return { ...optional, required: true };
		}

		if (this.isDeskBasedGroup3()) {
			if (this.isHeavyVehicle()) return { ...optional, required: !amending };
			if (this.isSmallTrl() && !amending) return optional;
		}

		if (this.isDeskBasedGroup4()) {
			if (this.isCar() || this.isLgv() || this.isMotorcycle()) return { ...optional, required: true };
			if (this.isPsv() && amending) return optional;
		}

		if (this.isDeskBasedGroup5()) {
			if (this.isHgv()) return { ...optional, required: true };
			if (this.isLgv()) return { ...optional, required: !amending };
		}

		return notApplicable;
	});

	readonly certificateNumberVisible = computed(() => {
		const mode = this.mode();
		if (mode !== Modes.VIEW && mode !== Modes.SUMMARY) {
			return this.certificateNumberRules().visible;
		}

		if (mode === Modes.SUMMARY && this.isGroup7()) return true;
		if (mode === Modes.SUMMARY && this.isCreateFlow() && this.isGroup5or13()) {
			return !this.isFail();
		}
		return this.isSpecialistGroup1() && this.isPassOrPrs() && this.certificateNumberRules().visible;
	});

	readonly hasOdometer = computed(() => {
		return !this.isTrl();
	});

	readonly timestampsReadOnly = computed(() => {
		return this.isAmendFlow() && !this.isSpecialistGroup1();
	});

	readonly fixedEuVehicleCategory = computed(() => {
		if (this.isCar()) return TechRecordEUCategory.M1;
		if (this.isLgv()) return TechRecordEUCategory.N1;
		return null;
	});

	readonly vtg15Applicable = computed(() => {
		const record = this.techRecord();
		return !!record && isAdrVehicle(record);
	});

	readonly seatbeltApplicable = computed(() => {
		return this.isPsv() && !this.isSpecialistGroup1() && !this.isGroup3And4And8();
	});

	readonly testTypeNameDisabled = computed(() => {
		return this.isAmendFlow() || this.showResult();
	});

	readonly amendmentMetadataVisible = computed(
		() =>
			(this.mode() === Modes.AMEND && !this.isSpecialistGroup1()) ||
			this.mode() === Modes.VIEW ||
			(this.mode() === Modes.SUMMARY && this.isAmendFlow())
	);

	readonly showLoadStatus = computed(() => {
		return this.loadStatusService.isLoadStatusApplicable(this.testResult());
	});

	readonly loadStatusRequired = computed(() => {
		return this.showLoadStatus() && !this.isAmendFlow();
	});

	readonly showExpiryDate = computed(() => {
		return this.isGroup7() && this.mode() !== Modes.ABANDON && !this.isAbandon() && !this.isFail();
	});

	readonly showAnniversaryDate = computed(() => {
		return !this.isGroup7() && !this.withoutTestDates() && !this.isGroup12or14();
	});

	readonly showReapplicationDate = computed(() => {
		return this.isSpecialistGroup1() && this.isFail();
	});

	// Mirrors the amend templates (master.template.ts) that define the abandonment fields with
	// RequiredIfEquals on testResult. Vehicle and group pairs without a dedicated template use the
	// default section, which has no abandonment fields, so nothing is enforced for them.
	readonly amendAbandonDetailsEnforced = computed(() => {
		const result = this.testResult();
		const testTypeId = this.testTypeId();
		// The API type omits small trailers, which the create journey still supports.
		const vehicle: string | undefined = result?.vehicleType;
		switch (vehicle) {
			case VehicleTypes.PSV:
				return [
					...TEST_TYPES_GROUP1,
					...TEST_TYPES_GROUP2,
					...TEST_TYPES_GROUP3_4_8,
					...TEST_TYPES_GROUP1_SPEC_TEST,
				].includes(testTypeId);
			case VehicleTypes.HGV:
			case VehicleTypes.TRL:
				return [
					...TEST_TYPES_GROUP3_4_8,
					...TEST_TYPES_GROUP7,
					...TEST_TYPES_GROUP9_10,
					...TEST_TYPES_GROUP9_10_CENTRAL_DOCS,
					...TEST_TYPES_GROUP12_14,
					...TEST_TYPES_GROUP5_13,
					...TEST_TYPES_GROUP1_SPEC_TEST,
				].includes(testTypeId);
			case VehicleTypes.LGV:
			case VehicleTypes.CAR:
			case VehicleTypes.MOTORCYCLE:
				return TEST_TYPES_GROUP1_SPEC_TEST.includes(testTypeId);
			default:
				return false;
		}
	});
	readonly amendingAbandonedTest = computed(
		() => this.mode() === Modes.AMEND && this.isAbandon() && this.amendAbandonDetailsEnforced()
	);
	readonly showCentralDocs = computed(() => {
		if (this.isSpecialistGroup1() || this.isGroup5or13()) {
			return this.isPassOrPrs();
		}
		return (this.isGroup7() || this.isGroup9And10CentralDocs()) && !this.isFail();
	});

	readonly customDefectSchema = schema<CustomDefectFormModel>((defect) => {
		required(defect.defectName, { message: 'Defect Name is required' });
		textLimit(defect.defectName, 'Defect Name', 200);
		required(defect.defectNotes, { message: 'Defect Notes is required' });
		textLimit(defect.defectNotes, 'Defect Notes', 500);
	});

	readonly testTypeSchema = schema<TestTypeFormModel>((testType) => {
		// Test details
		disabled(testType.testTypeName, { when: () => this.testTypeNameDisabled() });
		hidden(testType.testTypeName, {
			when: () =>
				!this.showResult() &&
				this.mode() !== Modes.AMEND &&
				this.mode() !== Modes.VIEW &&
				!(this.mode() === Modes.SUMMARY && this.isAmendFlow()),
		});
		for (const path of [testType.createdAt, testType.testCode, testType.testNumber]) {
			disabled(path, { when: () => this.isAmendFlow() });
			hidden(path, { when: () => !this.amendmentMetadataVisible() });
		}

		hidden(testType.certificateNumber, { when: () => !this.certificateNumberVisible() });
		required(testType.certificateNumber, {
			when: () => this.mode() !== Modes.ABANDON && this.certificateNumberRules().required,
			message: 'Certificate number is required',
		});
		required(testType.certificateNumber, {
			when: () => this.mode() !== Modes.ABANDON && this.certificateNumberRules().requiredWithResult,
			message: 'Certificate number is required with Result',
		});
		validate(testType.certificateNumber, ({ value }) => {
			const number = value();
			return number && !ALPHANUMERIC.test(number)
				? patternError(ALPHANUMERIC, { message: 'Certificate number must be alphanumeric' })
				: undefined;
		});

		// Both timestamps keep strings so GOV.UK validation can report incomplete input.
		// After migration, consider Date | null values so minDate() can use the start as the end's minimum.
		// Keep raw input in the date component for validation; parse and serialize ISO strings at the API DTO boundary.
		disabled(testType.testTypeStartTimestamp, { when: () => this.timestampsReadOnly() });
		required(testType.testTypeStartTimestamp, { message: 'Test start date and time is required' });
		validate(testType.testTypeStartTimestamp, ({ value }) => timestampError(value(), 'Test start date and time'));

		disabled(testType.testTypeEndTimestamp, { when: () => this.timestampsReadOnly() });
		required(testType.testTypeEndTimestamp, { message: 'Test end date and time is required' });
		validate(testType.testTypeEndTimestamp, ({ value, stateOf }) => {
			const end = value();
			const error = timestampError(end, 'Test end date and time');
			if (error || !end) return error;
			const startDate = validStart(stateOf(testType.testTypeStartTimestamp));
			return startDate && dayjs(end).isBefore(startDate)
				? {
						kind: 'aheadOfDate',
						message: `Test end date and time must be ahead of Test start date and time (${startDate.format('DD/MM/YYYY')})`,
					}
				: undefined;
		});

		// Result
		hidden(testType.testResult, { when: () => !this.showResult() });
		validate(testType.testResult, ({ value, valueOf }) => {
			if (!this.isSpecialistGroup1()) return undefined;
			const standards = valueOf(testType.requiredStandards);
			const result = value();
			let message: string | undefined;
			if (result === TestResults.PASS && standards?.length) {
				message = 'Cannot pass test when required standards are present';
			} else if (result === TestResults.FAIL && !standards?.length) {
				message = 'Cannot fail test when no required standards are present';
			} else if (result === TestResults.PRS && !standards?.length) {
				message = 'Cannot mark test as PRS when no required standards are present';
			}
			return message ? { kind: 'invalidTestResult', message } : undefined;
		});
		hidden(testType.prohibitionIssued, { when: () => !this.showResult() });
		validate(testType.prohibitionIssued, ({ value }) =>
			value() == null ? requiredError({ message: 'Prohibition issued is required' }) : undefined
		);
		hidden(testType.centralDocs.issueRequired, { when: () => !this.showCentralDocs() });

		// Test dates
		hidden(testType.testExpiryDate, {
			when: () => {
				const mode = this.mode();
				if (mode === Modes.VIEW || (mode === Modes.SUMMARY && this.isAmendFlow())) {
					return this.withoutTestDates();
				}
				if (mode === Modes.SUMMARY && this.isCreateFlow()) return !this.isGroup7();
				return !(this.showExpiryDate() || (mode === Modes.AMEND && !this.withoutTestDates() && !this.isGroup12or14()));
			},
		});
		required(testType.testExpiryDate, {
			when: ({ valueOf }) =>
				(this.mode() === Modes.AMEND &&
					valueOf(testType.testResult) === TestResults.PASS &&
					this.showAnniversaryDate()) ||
				this.showExpiryDate(),
			message: 'Expiry Date is required',
		});
		validate(testType.testExpiryDate, ({ value, stateOf }) =>
			dateAfterStartError(value(), 'Expiry Date', stateOf(testType.testTypeStartTimestamp))
		);
		validate(testType.testExpiryDate, ({ value }) =>
			this.isGroup7() && this.mode() === Modes.EDIT ? futureDateError(value(), 'Expiry Date') : undefined
		);

		hidden(testType.testAnniversaryDate, {
			when: () => {
				const mode = this.mode();
				if (mode === Modes.VIEW || (mode === Modes.SUMMARY && this.isAmendFlow())) {
					return this.withoutTestDates();
				}
				return mode !== Modes.AMEND || !this.showAnniversaryDate();
			},
		});
		required(testType.testAnniversaryDate, {
			when: ({ valueOf }) =>
				this.mode() === Modes.AMEND && valueOf(testType.testResult) === TestResults.PASS && this.showAnniversaryDate(),
			message: 'Anniversary date is required',
		});
		validate(testType.testAnniversaryDate, ({ value, stateOf }) =>
			dateAfterStartError(value(), 'Anniversary date', stateOf(testType.testTypeStartTimestamp))
		);

		hidden(testType.reapplicationDate, { when: () => !this.showReapplicationDate() });
		required(testType.reapplicationDate, { message: 'Reapplication date is required' });
		validate(testType.reapplicationDate, ({ value }) => {
			const date = value();
			if (!date) return undefined;
			const error = dateError(date, 'Reapplication date');
			return error ? { kind: 'invalidDate', message: error } : futureDateError(date, 'Reapplication date');
		});

		// Abandonment
		const abandonmentHidden = () => this.mode() !== Modes.ABANDON && !this.isAbandon();
		hidden(testType.reasonForAbandoning, { when: abandonmentHidden });
		validate(testType.reasonForAbandoning, ({ value }) => {
			const reason = value();
			const empty = !reason || (Array.isArray(reason) && reason.length === 0);
			if (!empty) return undefined;
			if (this.mode() === Modes.ABANDON) return requiredError({ message: 'Why was this test abandoned? is required' });
			return this.amendingAbandonedTest()
				? requiredError({ message: 'Reason for abandoning is required with Result' })
				: undefined;
		});
		hidden(testType.additionalCommentsForAbandon, { when: abandonmentHidden });
		// The character count always shows the limit, even where the length is not validated.
		metadata(testType.additionalCommentsForAbandon, MAX_LENGTH, () => 500);
		validate(testType.additionalCommentsForAbandon, ({ value }) => {
			const notes = value();
			if (this.mode() === Modes.ABANDON) {
				if (this.isSpecialistGroup1() || this.isSpecialistGroup5()) {
					return !notes
						? requiredError({ message: 'Enter additional notes as to why this test was abandoned' })
						: undefined;
				}
				return notes && notes.length > 500
					? maxLengthError(500, {
							message:
								'Additional notes as to why this test was abandoned (optional) must be less than or equal to 500 characters',
						})
					: undefined;
			}
			if (!this.amendingAbandonedTest()) return undefined;
			if (!notes) return requiredError({ message: 'Additional details for abandoning is required with Result' });
			return notes.length > 500
				? maxLengthError(500, {
						message: 'Additional details for abandoning must be less than or equal to 500 characters',
					})
				: undefined;
		});

		// Seatbelts
		const seatbeltCheckCarriedOut = ({ valueOf }: { valueOf: ValueOf }) =>
			valueOf(testType.seatbeltInstallationCheckDate) === true;
		hidden(testType.seatbeltInstallationCheckDate, { when: () => !this.seatbeltApplicable() });
		hidden(testType.numberOfSeatbeltsFitted, { when: () => !this.seatbeltApplicable() });
		hidden(testType.lastSeatbeltInstallationCheckDate, { when: () => !this.seatbeltApplicable() });
		validate(testType.seatbeltInstallationCheckDate, ({ value }) =>
			!this.isAbandoning() && typeof value() !== 'boolean'
				? requiredError({ message: 'Carried out during test is required' })
				: undefined
		);
		required(testType.numberOfSeatbeltsFitted, {
			when: seatbeltCheckCarriedOut,
			message: 'Number of seatbelts fitted is required with Carried out during test',
		});
		validate(testType.numberOfSeatbeltsFitted, ({ value }) => {
			const count = value();
			return count != null && count > 150
				? maxError(150, { message: 'Number of seatbelts fitted must be less than or equal to 150' })
				: undefined;
		});
		required(testType.lastSeatbeltInstallationCheckDate, {
			when: seatbeltCheckCarriedOut,
			message: 'Most recent installation check is required with Carried out during test',
		});
		validate(testType.lastSeatbeltInstallationCheckDate, ({ value }) => {
			const date = value();
			if (!date) return undefined;
			const error = dateError(date, 'Most recent installation check');
			if (error) return { kind: 'invalidDate', message: error };
			return dayjs(date).startOf('minute').isAfter(dayjs().endOf('minute'))
				? { kind: 'pastDate', message: 'Most recent installation check must be in the past' }
				: undefined;
		});

		// Notes
		textLimit(testType.additionalNotesRecorded, () => this.additionalNotesLabel(), 500);

		// Load status
		const loadStatus = testType.loadStatus;
		const loadStatusIs = (status: VehicleLoadStatusType, valueOf: ValueOf) =>
			valueOf(loadStatus.vehicleLoadStatus) === status;
		const unladen = ({ valueOf }: { valueOf: ValueOf }) => loadStatusIs(VehicleLoadStatusType.UNLADEN, valueOf);
		const partiallyLaden = ({ valueOf }: { valueOf: ValueOf }) =>
			loadStatusIs(VehicleLoadStatusType.PARTIALLY_LADEN, valueOf);
		const otherBodyType = (context: { valueOf: ValueOf }) =>
			unladen(context) && context.valueOf(loadStatus.unladenBodyType) === UnladenBodyType.OTHER;
		const otherReasonForNotLoading = (context: { valueOf: ValueOf }) =>
			unladen(context) && context.valueOf(loadStatus.reasonForNotLoading) === ReasonForNotLoading.OTHER;

		hidden(loadStatus, { when: () => !this.showLoadStatus() });
		required(loadStatus.vehicleLoadStatus, {
			when: () => this.loadStatusRequired(),
			message: 'Load status is required',
		});
		hidden(loadStatus.unladenBodyType, { when: (context) => !unladen(context) });
		required(loadStatus.unladenBodyType, { message: 'Body type is required' });
		hidden(loadStatus.reasonForNotLoading, { when: (context) => !unladen(context) });
		required(loadStatus.reasonForNotLoading, { message: 'Reason for not loading is required' });
		hidden(loadStatus.otherUnladenBodyType, { when: (context) => !otherBodyType(context) });
		required(loadStatus.otherUnladenBodyType, { message: 'Enter body type is required' });
		textLimit(loadStatus.otherUnladenBodyType, 'Enter body type', 200);
		hidden(loadStatus.partiallyLadenReason, { when: (context) => !partiallyLaden(context) });
		required(loadStatus.partiallyLadenReason, { message: 'Partially laden reason is required' });
		textLimit(loadStatus.partiallyLadenReason, 'Partially laden reason', 200);
		hidden(loadStatus.otherReasonForNotLoading, { when: (context) => !otherReasonForNotLoading(context) });
		required(loadStatus.otherReasonForNotLoading, { message: 'Enter reason for not loading is required' });
		textLimit(loadStatus.otherReasonForNotLoading, 'Enter reason for not loading', 200);

		// Defects
		hidden(testType.defects, { when: () => this.showResult() });
		hidden(testType.requiredStandards, { when: () => !this.isSpecialistGroup1() });
		hidden(testType.customDefects, { when: () => !this.isSpecialistGroup1() });
		applyEach(testType.customDefects, this.customDefectSchema);
	});

	/** The editable test result. Update it through {@link patch} or the field tree. */
	readonly model = signal<TestResultFormModel>(createInitialTestResultFormModel());

	readonly form = signalForm(this.model, (path) => {
		required(path.reasonForCreation, {
			message: 'Reason for creation is required',
			when: () => this.isCreateFlow() || this.isAmendFlow(),
		});
		maxLength(path.reasonForCreation, 100, {
			message: 'Reason for creation must be less than or equal to 100 characters',
		});

		// Visit
		required(path.testStationPNumber, { message: 'Test Station Details is required' });
		validate(path.testStationPNumber, ({ value }) => invalidOptionError(value(), 'Test Station Details'));
		disabled(path.testStationType, { when: () => true });
		required(path.testerStaffId, { message: 'Tester details is required' });
		validate(path.testerStaffId, ({ value }) => invalidOptionError(value(), 'Tester details'));

		hidden(path.contingencyTestNumber, {
			when: () => this.mode() !== Modes.EDIT && !this.isCreateFlow(),
		});
		required(path.contingencyTestNumber, {
			when: () => this.isCreateFlow(),
			message: 'Contingency Test Number is required',
		});
		validate(path.contingencyTestNumber, ({ value }) => {
			const number = value();
			if (!number) return undefined;
			if (number.length < 6) {
				return minLengthError(6, { message: 'Contingency Test Number must be greater than or equal to 6 characters' });
			}
			if (number.length > 8) {
				return maxLengthError(8, { message: 'Contingency Test Number must be less than or equal to 8 characters' });
			}
			return undefined;
		});

		// Vehicle
		required(path.countryOfRegistration, {
			when: () => !this.isAbandoning(),
			message: 'Country Of Registration is required',
		});
		validate(path.countryOfRegistration, ({ value }) => invalidOptionError(value(), 'Country Of Registration'));
		disabled(path.euVehicleCategory, { when: () => this.fixedEuVehicleCategory() !== null });
		required(path.euVehicleCategory, { message: 'EU Vehicle Category is required' });

		hidden(path.odometerReading, { when: () => !this.hasOdometer() });
		required(path.odometerReading, {
			when: () => !this.isAbandoning() && !this.isSpecialistGroup1() && (!this.isAbandon() || this.isGroup12or14()),
			message: 'Odometer Reading is required',
		});
		required(path.odometerReading, {
			when: ({ valueOf }) => {
				if (!this.requireOdometerPair() || !this.isSpecialistGroup1()) return false;
				const units = valueOf(path.odometerReadingUnits);
				return units === 'miles' || units === 'kilometres';
			},
			message: 'Odometer Reading is required with Odometer Reading Units',
		});
		validate(path.odometerReading, ({ value }) => {
			const reading = value();
			return reading != null && reading > 9999999
				? maxError(9999999, { message: 'Odometer Reading must be less than or equal to 9999999' })
				: undefined;
		});
		hidden(path.odometerReadingUnits, { when: () => !this.hasOdometer() });
		required(path.odometerReadingUnits, {
			when: () => this.requireOdometerPair() && !this.isSpecialistGroup1(),
			message: 'Odometer Reading Units is required',
		});
		required(path.odometerReadingUnits, {
			when: ({ valueOf }) =>
				this.requireOdometerPair() && this.isSpecialistGroup1() && valueOf(path.odometerReading) != null,
			message: 'Odometer Reading Units is required with Odometer Reading',
		});

		// VTG15
		const vtg15 = path.vtg15;
		const vtg15Selected = ({ valueOf }: { valueOf: ValueOf }) => valueOf(vtg15.vtg15Required) === true;
		hidden(vtg15.vtg15Required, { when: () => !this.vtg15Applicable() });
		validate(vtg15.vtg15Required, ({ value }) => {
			// Both Yes and No are valid answers to this required question.
			if (value() != null || this.mode() === Modes.AMEND) return undefined;
			const record = this.techRecord();
			return !!record && isAdrVehicle(record) && record?.techRecord_adrDetails_dangerousGoods === true
				? requiredError({ message: 'Select if a VTG15 is required' })
				: undefined;
		});
		const vtg15Hidden = (context: { valueOf: ValueOf }) => !this.vtg15Applicable() || !vtg15Selected(context);
		hidden(vtg15.primaryHazardClassification, { when: vtg15Hidden });
		hidden(vtg15.secondaryHazardClassification, { when: vtg15Hidden });
		hidden(vtg15.unNumber, { when: vtg15Hidden });
		required(vtg15.primaryHazardClassification, { message: 'Primary hazard classification is required' });
		required(vtg15.unNumber, { message: 'UN number is required' });
		validate(vtg15.unNumber, ({ value }) => {
			const number = value();
			return number && number.length !== 4 ? { kind: 'minLength', message: 'UN number must be 4 digits' } : undefined;
		});

		applyEach(path.testTypes, this.testTypeSchema);
	});

	/** The first (and only) test type of the test result. */
	get testType() {
		return this.form.testTypes[0];
	}

	/** The form value in the shape of the test result held in the store. */
	readonly value = computed(() => toTestResult(this.model()));

	/** Applies a (partial) test result to the form, keeping any field it does not include. */
	patch(value: Partial<TestResultSchema> | Record<string, unknown>): void {
		this.model.update((current) => patchTestResultFormModel(current, value));
	}

	resetForm(): void {
		const initial = createInitialTestResultFormModel();
		// Merge into the current test type so Signal Forms keeps the same field for it.
		this.model.update((current) => ({
			...initial,
			testTypes: current.testTypes.map((testType, index) => ({ ...testType, ...initial.testTypes[index] })),
		}));
		this.form().reset();
	}

	/** The id of the element a global error for the field links to. */
	errorAnchor(field: FieldTree<unknown>): string {
		const state = field();
		// Each additional defect has its own inputs, identified by the defect's position.
		const customDefect = state.name().match(/customDefects\.(\d+)\.(defectName|defectNotes)$/);
		return customDefect ? `${customDefect[2]}-${customDefect[1]}` : String(state.keyInParent());
	}
}

type ValueOf = FieldContext<unknown>['valueOf'];

const ALPHANUMERIC = /^[a-zA-Z0-9]*$/;

/**
 * Limits the length of a text field. Unlike the built-in `maxLength` rule this accepts a nullable value, and it still
 * provides the limit as metadata, which `[formField]` binds to the character count of a textarea.
 */
function textLimit<TPathKind extends PathKind>(
	path: SchemaPath<string | null, SchemaPathRules.Supported, TPathKind>,
	label: string | (() => string),
	limit: number
): void {
	metadata(path, MAX_LENGTH, () => limit);
	validate(path, ({ value }) =>
		(value()?.length ?? 0) > limit
			? maxLengthError(limit, {
					message: `${typeof label === 'string' ? label : label()} must be less than or equal to ${limit} characters`,
				})
			: undefined
	);
}

function invalidOptionError(value: string | null, label: string) {
	return value === '[INVALID_OPTION]' ? { kind: 'invalidOption', message: `${label} is invalid` } : undefined;
}

/** The start date when the start timestamp holds a valid value. */
function validStart(start: { value: () => string | null; valid: () => boolean }) {
	const value = start.value();
	return value && start.valid() ? dayjs(value) : undefined;
}

function dateAfterStartError(
	value: string | null,
	label: string,
	start: { value: () => string | null; valid: () => boolean }
) {
	if (!value) return undefined;
	const error = dateError(value, label);
	if (error) return { kind: 'invalidDate', message: error };
	const startDate = validStart(start);
	const date = dayjs(value);
	return startDate && date.isValid() && startDate.isValid() && date.isBefore(startDate)
		? { kind: 'aheadOfDate', message: `${label} must be ahead of Start Time (${startDate.format('DD/MM/YYYY')})` }
		: undefined;
}

function timestampError(value: string | null, label: string) {
	if (!value) return undefined;
	const formatError = dateTimeError(value, label);
	if (formatError) return { kind: 'datetime', message: formatError };
	if (dayjs(value).startOf('minute').isAfter(dayjs().endOf('minute'))) {
		return { kind: 'pastDate', message: `${label} must be in the past` };
	}
	return undefined;
}

function futureDateError(value: string | null | undefined, label: string) {
	if (!value || dateError(value, label)) return undefined;
	const date = dayjs(value);
	return date.isValid() && date.startOf('minute').isBefore(dayjs().startOf('minute'))
		? { kind: 'futureDate', message: `${label} must be in the future` }
		: undefined;
}
