import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
	applyWhen,
	disabled,
	hidden,
	maxError,
	maxLength,
	patternError,
	required,
	validate,
} from '@angular/forms/signals';
import { SignalFormControl } from '@angular/forms/signals/compat';
import { HazardClassification } from '@dvsa/cvs-type-definitions/types/enums/hazardClassification.enum';
import { ReasonForNotLoading } from '@dvsa/cvs-type-definitions/types/v1/enums/reasonForNotLoading.enum';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { UnladenBodyType } from '@dvsa/cvs-type-definitions/types/v1/enums/unladenBodyType.enum';
import { VehicleLoadStatusType } from '@dvsa/cvs-type-definitions/types/v1/enums/vehicleLoadStatus.enum';
import {
	DefectDetailsSchema,
	EUVehicleCategory,
	EmissionStandards,
	FuelType,
	MediaSchema,
	ModTypeSchema,
	OdometerReadingUnits,
	RecallsSchema,
	SpecialistCustomDefectsSchema,
	SpecialistCustomDefectsSchemaPut,
	TestSources,
	TestStationTypes,
	TestStatus,
	TypeOfTest,
	VehicleType,
} from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { dateTimeError } from '@forms/validators/date-time-error';
import {
	TEST_TYPES_GROUP1_DESK_BASED_TEST,
	TEST_TYPES_GROUP1_SPEC_TEST,
	TEST_TYPES_GROUP2_DESK_BASED_TEST,
	TEST_TYPES_GROUP3_DESK_BASED_TEST,
	TEST_TYPES_GROUP4_DESK_BASED_TEST,
	TEST_TYPES_GROUP5_13,
	TEST_TYPES_GROUP5_DESK_BASED_TEST,
	TEST_TYPES_GROUP5_SPEC_TEST,
	TEST_TYPES_GROUP7,
	TEST_TYPES_GROUP12_14,
	TEST_TYPES_GROUP15_16,
} from '@models/testTypeId.enum';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { techRecord } from '@store/technical-records';
import { isTestTypeOldIvaOrMsva, toEditOrNotToEdit } from '@store/test-records';
import dayjs from 'dayjs';
import { Modes } from '../../models/modes.enum';

const START_TIMESTAMP_LABEL = 'Test start date and time';
const END_TIMESTAMP_LABEL = 'Test end date and time';

function timestampError(value: string | null, label: string) {
	if (!value) return undefined;
	const formatError = dateTimeError(value, label);
	if (formatError) return { kind: 'datetime', message: formatError };
	if (dayjs(value).startOf('minute').isAfter(dayjs().endOf('minute'))) {
		return { kind: 'pastDate', message: `${label} must be in the past` };
	}
	return undefined;
}

@Injectable({
	providedIn: 'root',
})
export class TestService {
	fb = inject(FormBuilder);

	/**
	 * True while the user is abandoning the test (from clicking "Mark as abandoned" until they either
	 * submit the abandonment or cancel out of it). Sections read this to skip the validation that only
	 * applies to a test that is being completed, mirroring the `requiredIfNotAbandoned` async validator
	 * used by the dynamic form service.
	 */
	isAbandoning = signal(false);

	mode = signal<Modes | null>(null);
	initialMode = signal<Modes | null>(null);
	private readonly store = inject(Store);
	private readonly testResult = this.store.selectSignal(toEditOrNotToEdit);
	private readonly oldSpecialist = this.store.selectSignal(isTestTypeOldIvaOrMsva);
	private readonly techRecord = this.store.selectSignal(techRecord);
	private readonly hasOdometer = computed(() => {
		const vehicle = this.techRecord();
		return !!vehicle && vehicle.techRecord_vehicleType !== VehicleTypes.TRL;
	});
	private readonly isSpecialistGroup1 = computed(() =>
		TEST_TYPES_GROUP1_SPEC_TEST.includes(this.testResult()?.testTypes?.[0]?.testTypeId ?? '')
	);
	readonly odometerUsesPairedFields = this.isSpecialistGroup1;
	private readonly recordedAsAbandoned = computed(
		() => this.testResult()?.testTypes?.[0]?.testResult === TestResults.ABANDONED
	);
	private readonly requireOdometerPair = computed(() => !this.isAbandoning() && !this.recordedAsAbandoned());
	private readonly certificateNumberRules = computed(() => {
		const result = this.testResult();
		const test = result?.testTypes?.[0];
		// The API type omits small trailers, which the create journey still supports.
		const vehicle: string | undefined = result?.vehicleType;
		const notApplicable = { visible: false, required: false, requiredWithResult: false };
		if (!test?.testTypeId || !vehicle) return notApplicable;

		const mode = this.mode();
		const journey = this.initialMode();
		const amending = mode === Modes.AMEND || mode === Modes.VIEW || journey === Modes.AMEND || journey === Modes.VIEW;
		const { testTypeId, testResult: outcome } = test;
		const passed = outcome === TestResults.PASS;
		const failed = outcome === TestResults.FAIL;
		const passedOrPrs = passed || outcome === TestResults.PRS;
		const issuedCentrally = test.centralDocs?.issueRequired === true;
		const hgvOrTrl = vehicle === VehicleTypes.HGV || vehicle === VehicleTypes.TRL;
		const psv = vehicle === VehicleTypes.PSV;
		const lightVehicle = vehicle === VehicleTypes.CAR || vehicle === VehicleTypes.LGV;
		const motorcycle = vehicle === VehicleTypes.MOTORCYCLE;
		const optional = { ...notApplicable, visible: true };

		if (hgvOrTrl && TEST_TYPES_GROUP7.includes(testTypeId)) {
			// ADR amendments can retain a manually entered number for PRS or abandoned tests.
			const visible = amending
				? outcome === TestResults.ABANDONED || (passedOrPrs && !issuedCentrally)
				: passed && !issuedCentrally;
			return { ...optional, visible, requiredWithResult: passed && !issuedCentrally };
		}
		if (hgvOrTrl && !amending && TEST_TYPES_GROUP5_13.includes(testTypeId)) {
			const visible = passed && !issuedCentrally;
			return { ...optional, visible, requiredWithResult: visible };
		}
		if ((psv || vehicle === VehicleTypes.HGV) && TEST_TYPES_GROUP15_16.includes(testTypeId)) {
			return { ...optional, visible: !(amending && passedOrPrs && issuedCentrally), required: true };
		}

		if ((hgvOrTrl || psv || lightVehicle || motorcycle) && TEST_TYPES_GROUP1_SPEC_TEST.includes(testTypeId)) {
			if (amending && this.oldSpecialist()) return optional;
			if (hgvOrTrl) return { ...optional, visible: !failed, requiredWithResult: passedOrPrs };
			return {
				...optional,
				visible: !failed && !(passedOrPrs && issuedCentrally),
				requiredWithResult: passed && !issuedCentrally,
			};
		}
		if ((hgvOrTrl || psv || lightVehicle) && TEST_TYPES_GROUP5_SPEC_TEST.includes(testTypeId)) {
			if (amending && this.oldSpecialist()) return notApplicable;
			return { ...optional, visible: !failed, requiredWithResult: passedOrPrs };
		}

		if (psv && TEST_TYPES_GROUP1_DESK_BASED_TEST.includes(testTypeId)) {
			// New PSV desk-based group 1 tests default to Pass before the result is populated.
			return { ...optional, requiredWithResult: passed || (!amending && outcome === undefined) };
		}
		if ((hgvOrTrl || psv) && TEST_TYPES_GROUP2_DESK_BASED_TEST.includes(testTypeId)) {
			return { ...optional, required: true };
		}
		if (TEST_TYPES_GROUP3_DESK_BASED_TEST.includes(testTypeId)) {
			if (hgvOrTrl || psv) return { ...optional, required: !amending };
			if (vehicle === VehicleTypes.SMALL_TRL && !amending) return optional;
		}
		if (TEST_TYPES_GROUP4_DESK_BASED_TEST.includes(testTypeId)) {
			if (lightVehicle || motorcycle) return { ...optional, required: true };
			if (psv && amending) return optional;
		}
		if (TEST_TYPES_GROUP5_DESK_BASED_TEST.includes(testTypeId)) {
			if (vehicle === VehicleTypes.HGV) return { ...optional, required: true };
			if (vehicle === VehicleTypes.LGV) return { ...optional, required: !amending };
		}

		return notApplicable;
	});

	/**
	 * Define individual signal form controls here, then reference in the form.
	 * Once all controls have been migrated, the form can use a single signal and
	 * the Angular form() helper instead.
	 */
	reasonForCreation = new SignalFormControl<string>('', (schema) => {
		required(schema, { message: 'Reason for creation is required' });
		maxLength(schema, 100, { message: 'Reason for creation must be less than or equal to 100 characters' });
	});

	odometerReading = new SignalFormControl<number | null | undefined>(undefined, (schema) => {
		hidden(schema, { when: () => !this.hasOdometer() });
		applyWhen(
			schema,
			() =>
				!this.isAbandoning() &&
				!this.odometerUsesPairedFields() &&
				(!this.recordedAsAbandoned() ||
					TEST_TYPES_GROUP12_14.includes(this.testResult()?.testTypes?.[0]?.testTypeId ?? '')),
			(path) => required(path, { message: 'Odometer Reading is required' })
		);
		applyWhen(
			schema,
			() => {
				if (!this.requireOdometerPair() || !this.odometerUsesPairedFields()) return false;
				const units = this.odometerReadingUnits.fieldTree().value();
				return units === 'miles' || units === 'kilometres';
			},
			(path) => required(path, { message: 'Odometer Reading is required with Odometer Reading Units' })
		);
		validate(schema, ({ value }) => {
			const reading = value();
			return reading != null && reading > 9999999
				? maxError(9999999, { message: 'Odometer Reading must be less than or equal to 9999999' })
				: undefined;
		});
	});

	odometerReadingUnits = new SignalFormControl<OdometerReadingUnits | null | undefined>(undefined, (schema) => {
		hidden(schema, { when: () => !this.hasOdometer() });
		applyWhen(
			schema,
			() => this.requireOdometerPair() && !this.odometerUsesPairedFields(),
			(path) => required(path, { message: 'Odometer Reading Units is required' })
		);
		applyWhen(
			schema,
			() =>
				this.requireOdometerPair() &&
				this.odometerUsesPairedFields() &&
				this.odometerReading.fieldTree().value() != null,
			(path) => required(path, { message: 'Odometer Reading Units is required with Odometer Reading' })
		);
	});

	certificateNumber = new SignalFormControl<string | null>(null, (schema) => {
		hidden(schema, { when: () => !this.certificateNumberRules().visible });
		applyWhen(
			schema,
			() => this.mode() !== Modes.ABANDON && this.certificateNumberRules().required,
			(path) => required(path, { message: 'Certificate number is required' })
		);
		applyWhen(
			schema,
			() => this.mode() !== Modes.ABANDON && this.certificateNumberRules().requiredWithResult,
			(path) => required(path, { message: 'Certificate number is required with Result' })
		);
		const alphanumeric = /^[a-zA-Z0-9]*$/;
		validate(schema, ({ value }) => {
			const number = value();
			return number && !alphanumeric.test(number)
				? patternError(alphanumeric, { message: 'Certificate number must be alphanumeric' })
				: undefined;
		});
	});

	testStationName = new SignalFormControl<string | null>(null);

	testStationPNumber = new SignalFormControl<string | null>(null, (path) => {
		required(path, { message: 'Test Station Details is required' });
		validate(path, ({ value }) =>
			value() === '[INVALID_OPTION]' ? { kind: 'invalidOption', message: 'Test Station Details is invalid' } : undefined
		);
	});

	testStationType = new SignalFormControl<TestStationTypes | null>(null, (path) => {
		disabled(path, { when: () => true });
	});

	testerName = new SignalFormControl<string | null>(null);

	testerStaffId = new SignalFormControl<string>('', (path) => {
		required(path, { message: 'Tester details is required' });
		validate(path, ({ value }) =>
			value() === '[INVALID_OPTION]' ? { kind: 'invalidOption', message: 'Tester details is invalid' } : undefined
		);
	});

	testerEmailAddress = new SignalFormControl<string | null>(null);

	private readonly timestampsReadOnly = computed(
		() => this.initialMode() === Modes.AMEND && !this.isSpecialistGroup1()
	);

	// Both timestamp controls keep strings so GOV.UK validation can report incomplete input.
	// After migration, consider Date | null values so minDate() can use the start as the end's minimum.
	// Keep raw input in the date component for validation; parse and serialize ISO strings at the API DTO boundary.
	testTypeStartTimestamp = new SignalFormControl<string | null>(null, (path) => {
		disabled(path, { when: () => this.timestampsReadOnly() });
		required(path, { message: `${START_TIMESTAMP_LABEL} is required` });
		validate(path, ({ value }) => timestampError(value(), START_TIMESTAMP_LABEL));
	});

	testTypeEndTimestamp = new SignalFormControl<string | null>(null, (path) => {
		disabled(path, { when: () => this.timestampsReadOnly() });
		required(path, { message: `${END_TIMESTAMP_LABEL} is required` });
		validate(path, ({ value }) => {
			const end = value();
			const error = timestampError(end, END_TIMESTAMP_LABEL);
			if (error || !end) return error;

			const start = this.testTypeStartTimestamp.fieldTree();
			const startValue = start.value();
			if (!startValue || !start.valid()) return undefined;

			const startDate = dayjs(startValue);
			if (dayjs(end).isBefore(startDate)) {
				return {
					kind: 'aheadOfDate',
					message: `${END_TIMESTAMP_LABEL} must be ahead of ${START_TIMESTAMP_LABEL} (${startDate.format('DD/MM/YYYY')})`,
				};
			}
			return undefined;
		});
	});

	testStartTimestamp = new SignalFormControl<string | undefined>('');
	testEndTimestamp = new SignalFormControl<string | undefined>('');

	// Form
	form = this.fb.group({
		testResultId: this.fb.nonNullable.control<string>(''),
		testStationName: this.testStationName,
		testStationPNumber: this.testStationPNumber,
		testStationType: this.testStationType,
		testerName: this.testerName,
		testerStaffId: this.testerStaffId,
		testerEmailAddress: this.testerEmailAddress,
		testStartTimestamp: this.testStartTimestamp,
		testEndTimestamp: this.testEndTimestamp,
		testStatus: this.fb.nonNullable.control<TestStatus>('submitted' as TestStatus),
		reasonForCancellation: this.fb.control<string | null>(null),
		systemNumber: this.fb.nonNullable.control<string>(''),
		vrm: this.fb.nonNullable.control<string | undefined>({ value: undefined, disabled: false }),
		trailerId: this.fb.nonNullable.control<string | undefined>({ value: undefined, disabled: false }),
		vin: this.fb.nonNullable.control<string>(''),
		vehicleClass: this.fb.group({
			code: this.fb.nonNullable.control<string>(''),
			description: this.fb.nonNullable.control<string>(''),
		}),
		vehicleSubclass: this.fb.nonNullable.control<string[] | undefined>({ value: undefined, disabled: false }),
		vehicleType: this.fb.nonNullable.control<VehicleType>('car'),
		vehicleConfiguration: this.fb.nonNullable.control<string>(''),
		odometerReading: this.odometerReading,
		odometerReadingUnits: this.odometerReadingUnits,
		preparerId: this.fb.control<string | null>(null),
		preparerName: this.fb.control<string | null>(null),
		euVehicleCategory: this.fb.control<EUVehicleCategory | null>(null),
		countryOfRegistration: this.fb.control<string | null>(null),
		noOfAxles: this.fb.control<number | null>(null),
		numberOfWheelsDriven: this.fb.control<number | null>(null),
		vehicleSize: this.fb.nonNullable.control<string | undefined>({ value: undefined, disabled: false }),
		numberOfSeats: this.fb.nonNullable.control<number | undefined>({ value: undefined, disabled: false }),
		regnDate: this.fb.control<string | null | undefined>({ value: undefined, disabled: false }),
		firstUseDate: this.fb.control<string | null | undefined>({ value: undefined, disabled: false }),
		media: this.fb.nonNullable.control<MediaSchema[] | undefined>({ value: undefined, disabled: false }),
		reasonForCreation: this.reasonForCreation,
		createdAt: this.fb.control<string | null>(null),
		createdByEmailAddress: this.fb.nonNullable.control<string | undefined>({ value: undefined, disabled: false }),
		createdByName: this.fb.nonNullable.control<string>(''),
		createdById: this.fb.nonNullable.control<string>(''),
		lastUpdatedAt: this.fb.control<string | null>(null),
		lastUpdatedByEmailAddress: this.fb.nonNullable.control<string | undefined>({ value: undefined, disabled: false }),
		lastUpdatedByName: this.fb.nonNullable.control<string>(''),
		lastUpdatedById: this.fb.nonNullable.control<string>(''),
		contingencyTestNumber: this.fb.control<string | null>(null),
		typeOfTest: this.fb.nonNullable.control<TypeOfTest>('contingency' as TypeOfTest),
		source: this.fb.nonNullable.control<TestSources>('vtm' as TestSources),
		make: this.fb.control<string | null>(null),
		model: this.fb.control<string | null>(null),
		bodyType: this.fb.group({
			code: this.fb.control<string>(''),
			description: this.fb.control<string>(''),
		}),
		recalls: this.fb.control<RecallsSchema | undefined>({ value: undefined, disabled: false }),
		testTypes: this.fb.array([
			this.fb.group({
				testTypeName: this.fb.control<string | null>(null),
				name: this.fb.control<string>(''),
				testTypeId: this.fb.control<string>(''),
				certificateNumber: this.certificateNumber,
				secondaryCertificateNumber: this.fb.control<string | null>(null),
				testTypeStartTimestamp: this.testTypeStartTimestamp,
				testTypeEndTimestamp: this.testTypeEndTimestamp,
				testResult: this.fb.control<TestResults | null>(null),
				prohibitionIssued: this.fb.control<boolean | null>(null),
				reasonForAbandoning: this.fb.control<string | null>(null),
				additionalNotesRecorded: this.fb.control<string | null>(null),
				additionalCommentsForAbandon: this.fb.control<string | null>(null),
				numberOfSeatbeltsFitted: this.fb.control<number | null | undefined>({ value: undefined, disabled: false }),
				lastSeatbeltInstallationCheckDate: this.fb.control<string | null | undefined>({
					value: undefined,
					disabled: false,
				}),
				seatbeltInstallationCheckDate: this.fb.control<boolean | null | undefined>({
					value: undefined,
					disabled: false,
				}),
				testExpiryDate: this.fb.control<string | undefined>({ value: undefined, disabled: false }),
				testAnniversaryDate: this.fb.control<string | null | undefined>({ value: undefined, disabled: false }),
				modType: this.fb.control<ModTypeSchema | undefined>({ value: undefined, disabled: false }),
				emissionStandard: this.fb.control<EmissionStandards | null | undefined>({ value: undefined, disabled: false }),
				fuelType: this.fb.control<FuelType | null | undefined>({ value: undefined, disabled: false }),
				modificationTypeUsed: this.fb.control<string | null | undefined>({ value: undefined, disabled: false }),
				smokeTestKLimitApplied: this.fb.control<string | null | undefined>({ value: undefined, disabled: false }),
				particulateTrapFitted: this.fb.control<string | null | undefined>({ value: undefined, disabled: false }),
				particulateTrapSerialNumber: this.fb.control<string | null | undefined>({ value: undefined, disabled: false }),
				defects: this.fb.nonNullable.control<DefectDetailsSchema[]>([]),
				customDefects: this.fb.control<SpecialistCustomDefectsSchema[] | undefined>([]),
				requiredStandards: this.fb.control<SpecialistCustomDefectsSchemaPut[] | undefined>({
					value: undefined,
					disabled: false,
				}),
				testNumber: this.fb.control<string | null | undefined>({ value: undefined, disabled: false }),
				reapplicationDate: this.fb.control<string | null | undefined>({ value: undefined, disabled: false }),
				testCode: this.fb.control<string | null | undefined>({ value: undefined, disabled: false }),
				createdAt: this.fb.control<string | null | undefined>({ value: undefined, disabled: false }),
				testTypeClassification: this.fb.control<string | null | undefined>({ value: undefined, disabled: false }),
				centralDocs: this.fb.group({
					issueRequired: this.fb.control<boolean>(false),
					notes: this.fb.control<string>(' '),
					reasonsForIssue: this.fb.control<string[]>([]),
				}),
				loadStatus: this.fb.group({
					vehicleLoadStatus: this.fb.control<VehicleLoadStatusType | null | undefined>({
						value: undefined,
						disabled: false,
					}),
					unladenBodyType: this.fb.control<UnladenBodyType | null | undefined>({ value: undefined, disabled: false }),
					otherUnladenBodyType: this.fb.control<string | null | undefined>({ value: undefined, disabled: false }),
					reasonForNotLoading: this.fb.control<ReasonForNotLoading | null | undefined>({
						value: undefined,
						disabled: false,
					}),
					partiallyLadenReason: this.fb.control<string | null | undefined>({ value: undefined, disabled: false }),
					otherReasonForNotLoading: this.fb.control<string | null | undefined>({ value: undefined, disabled: false }),
				}),
			}),
		]),
		vtg15: this.fb.group({
			vtg15Required: this.fb.control<boolean | undefined>({ value: undefined, disabled: false }),
			primaryHazardClassification: this.fb.control<HazardClassification | undefined>({
				value: undefined,
				disabled: false,
			}),
			secondaryHazardClassification: this.fb.control<HazardClassification | undefined>({
				value: undefined,
				disabled: false,
			}),
			unNumber: this.fb.control<string | undefined>({ value: undefined, disabled: false }),
			media: this.fb.control<MediaSchema[] | undefined>({
				value: [{ path: ' ', reason: 'Contingency test', type: 'failReason' }],
				disabled: false,
			}),
		}),
	});

	constructor() {
		effect(() => {
			this.initialMode();
			// A change to a signal rule does not automatically recalculate the reactive parent.
			untracked(() => this.form.updateValueAndValidity());
		});
		effect(() => {
			this.certificateNumber.status;
			this.testTypeStartTimestamp.status;
			this.testTypeEndTimestamp.status;
			untracked(() => this.certificateNumber.parent?.updateValueAndValidity({ emitEvent: false }));
		});
		effect(() => {
			this.odometerReading.status;
			this.odometerReadingUnits.status;
			untracked(() => this.form.updateValueAndValidity({ emitEvent: false }));
		});
		this.mirrorTimestamp(this.testTypeStartTimestamp, this.testStartTimestamp);
		this.mirrorTimestamp(this.testTypeEndTimestamp, this.testEndTimestamp);
	}

	private mirrorTimestamp(source: SignalFormControl<string | null>, target: SignalFormControl<string | undefined>) {
		let previous = source.fieldTree().value();
		effect(() => {
			const value = source.fieldTree().value();
			if (value === previous) return;
			previous = value;
			// The API expects the timestamps at both levels of the test result.
			untracked(() => {
				const timestamp = value || undefined;
				if (target.value !== timestamp) target.setValue(timestamp, { emitEvent: false });
			});
		});
	}
}

export const INITIAL_TEST_RESULT_FORM_VALUE = {
	testResultId: '',
	testStationName: null,
	testStationPNumber: null,
	testStationType: null,
	testerName: null,
	testerStaffId: '',
	testerEmailAddress: null,
	testStartTimestamp: '',
	testEndTimestamp: '',
	testStatus: 'submitted' as TestStatus,
	reasonForCancellation: null,
	systemNumber: '',
	vrm: undefined,
	trailerId: undefined,
	vin: '',
	vehicleClass: {
		code: '',
		description: '',
	},
	vehicleSubclass: undefined,
	vehicleType: 'car' as VehicleType,
	vehicleConfiguration: '',
	odometerReading: undefined,
	odometerReadingUnits: undefined,
	preparerId: null,
	preparerName: null,
	euVehicleCategory: null,
	countryOfRegistration: null,
	noOfAxles: null,
	numberOfWheelsDriven: null,
	vehicleSize: undefined,
	numberOfSeats: undefined,
	regnDate: undefined,
	firstUseDate: undefined,
	media: undefined,
	reasonForCreation: '',
	createdAt: null,
	createdByEmailAddress: undefined,
	createdByName: '',
	createdById: '',
	lastUpdatedAt: null,
	lastUpdatedByEmailAddress: undefined,
	lastUpdatedByName: '',
	lastUpdatedById: '',
	contingencyTestNumber: null,
	typeOfTest: 'contingency' as TypeOfTest,
	source: 'vtm' as TestSources,
	make: null,
	model: null,
	bodyType: {
		code: '',
		description: '',
	},
	recalls: undefined,
	testTypes: [
		{
			testTypeName: null,
			name: '',
			testTypeId: '',
			certificateNumber: null,
			secondaryCertificateNumber: null,
			testTypeStartTimestamp: null,
			testTypeEndTimestamp: null,
			testResult: null,
			prohibitionIssued: null,
			reasonForAbandoning: null,
			additionalNotesRecorded: null,
			additionalCommentsForAbandon: null,
			numberOfSeatbeltsFitted: undefined,
			lastSeatbeltInstallationCheckDate: undefined,
			seatbeltInstallationCheckDate: undefined,
			testExpiryDate: undefined,
			testAnniversaryDate: '',
			modType: undefined,
			emissionStandard: undefined,
			fuelType: undefined,
			modificationTypeUsed: undefined,
			smokeTestKLimitApplied: undefined,
			particulateTrapFitted: undefined,
			particulateTrapSerialNumber: undefined,
			defects: [],
			customDefects: [],
			requiredStandards: undefined,
			testNumber: undefined,
			reapplicationDate: undefined,
			testCode: undefined,
			createdAt: undefined,
			testTypeClassification: undefined,
			loadStatus: {},
			centralDocs: {
				issueRequired: false,
				notes: ' ',
				reasonsForIssue: [],
			},
		},
	],
};
