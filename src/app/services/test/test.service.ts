import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
	applyWhen,
	disabled,
	hidden,
	maxError,
	maxLength,
	maxLengthError,
	minLengthError,
	patternError,
	required,
	requiredError,
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
import { EUVehicleCategory as TechRecordEUCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { dateError, dateTimeError } from '@forms/validators/date-time-error';
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
import { LoadStatusService } from '@services/load-status/load-status.service';
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
	private readonly loadStatusService = inject(LoadStatusService);
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

	readonly contingencyTestNumberVisible = computed(() => this.mode() === Modes.EDIT);
	contingencyTestNumber = new SignalFormControl<string | null>(null, (path) => {
		required(path, {
			when: () => this.initialMode() === Modes.EDIT,
			message: 'Contingency Test Number is required',
		});
		validate(path, ({ value }) => {
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
	});

	countryOfRegistration = new SignalFormControl<string | null>(null, (path) => {
		required(path, { when: () => !this.isAbandoning(), message: 'Country Of Registration is required' });
		validate(path, ({ value }) =>
			value() === '[INVALID_OPTION]'
				? { kind: 'invalidOption', message: 'Country Of Registration is invalid' }
				: undefined
		);
	});

	readonly fixedEuVehicleCategory = computed(() => {
		const vehicleType = this.techRecord()?.techRecord_vehicleType;
		if (vehicleType === VehicleTypes.CAR) return TechRecordEUCategory.M1;
		if (vehicleType === VehicleTypes.LGV) return TechRecordEUCategory.N1;
		return null;
	});
	euVehicleCategory = new SignalFormControl<EUVehicleCategory | null>(null, (path) => {
		disabled(path, { when: () => this.fixedEuVehicleCategory() !== null });
		required(path, { message: 'EU Vehicle Category is required' });
	});

	vtg15Required = new SignalFormControl<boolean | null | undefined>(undefined, (path) => {
		validate(path, ({ value }) => {
			// Both Yes and No are valid answers to this required question.
			if (value() != null || this.mode() === Modes.AMEND) return undefined;
			const record = this.techRecord();
			const type = record?.techRecord_vehicleType;
			return (type === VehicleTypes.HGV || type === VehicleTypes.LGV || type === VehicleTypes.TRL) &&
				record?.techRecord_adrDetails_dangerousGoods === true
				? requiredError({ message: 'Select if a VTG15 is required' })
				: undefined;
		});
	});
	private readonly vtg15Selected = computed(() => this.vtg15Required.fieldTree().value() === true);
	primaryHazardClassification = new SignalFormControl<HazardClassification | null | undefined>(undefined, (path) => {
		required(path, { when: this.vtg15Selected, message: 'Primary hazard classification is required' });
	});
	unNumber = new SignalFormControl<string | null | undefined>(undefined, (path) => {
		required(path, { when: this.vtg15Selected, message: 'UN number is required' });
		validate(path, ({ value }) => {
			const number = value();
			return this.vtg15Selected() && number && number.length !== 4
				? { kind: 'minLength', message: 'UN number must be 4 digits' }
				: undefined;
		});
	});

	private readonly seatbeltApplicable = computed(() => {
		const result = this.testResult();
		return (
			result?.vehicleType === VehicleTypes.PSV && !TEST_TYPES_GROUP1_SPEC_TEST.includes(result.testTypes[0].testTypeId)
		);
	});
	seatbeltInstallationCheckDate = new SignalFormControl<boolean | null | undefined>(undefined, (path) => {
		validate(path, ({ value }) =>
			this.seatbeltApplicable() && !this.isAbandoning() && typeof value() !== 'boolean'
				? requiredError({ message: 'Carried out during test is required' })
				: undefined
		);
	});
	private readonly seatbeltCheckCarriedOut = computed(
		() => this.seatbeltApplicable() && this.seatbeltInstallationCheckDate.fieldTree().value() === true
	);
	numberOfSeatbeltsFitted = new SignalFormControl<number | null | undefined>(undefined, (path) => {
		required(path, {
			when: this.seatbeltCheckCarriedOut,
			message: 'Number of seatbelts fitted is required with Carried out during test',
		});
		validate(path, ({ value }) => {
			const count = value();
			return this.seatbeltApplicable() && count != null && count > 150
				? maxError(150, { message: 'Number of seatbelts fitted must be less than or equal to 150' })
				: undefined;
		});
	});
	lastSeatbeltInstallationCheckDate = new SignalFormControl<string | null | undefined>(undefined, (path) => {
		required(path, {
			when: this.seatbeltCheckCarriedOut,
			message: 'Most recent installation check is required with Carried out during test',
		});
		validate(path, ({ value }) => {
			const date = value();
			if (!this.seatbeltApplicable() || !date) return undefined;
			const error = dateError(date, 'Most recent installation check');
			if (error) return { kind: 'invalidDate', message: error };
			return dayjs(date).startOf('minute').isAfter(dayjs().endOf('minute'))
				? { kind: 'pastDate', message: 'Most recent installation check must be in the past' }
				: undefined;
		});
	});

	additionalNotesRecorded = new SignalFormControl<string | null>(null, (path) => {
		validate(path, ({ value }) => {
			const notes = value();
			if (!notes || notes.length <= 500) return undefined;
			const label = TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '')
				? 'Additional Notes'
				: 'Additional Notes (optional)';
			return maxLengthError(500, { message: `${label} must be less than or equal to 500 characters` });
		});
	});

	private readonly testTypeNameDisabled = computed(() => {
		const id = this.testResult()?.testTypes[0].testTypeId ?? '';
		return (
			this.initialMode() === Modes.AMEND ||
			TEST_TYPES_GROUP7.includes(id) ||
			TEST_TYPES_GROUP1_SPEC_TEST.includes(id) ||
			TEST_TYPES_GROUP5_13.includes(id)
		);
	});
	testTypeName = new SignalFormControl<string | null>(null, (path) => {
		disabled(path, { when: this.testTypeNameDisabled });
	});
	testTypeCreatedAt = new SignalFormControl<string | null | undefined>(undefined, (path) => {
		disabled(path, { when: () => this.initialMode() === Modes.AMEND });
	});
	testCode = new SignalFormControl<string | null | undefined>(undefined, (path) => {
		disabled(path, { when: () => this.initialMode() === Modes.AMEND });
	});
	testNumber = new SignalFormControl<string | null | undefined>(undefined, (path) => {
		disabled(path, { when: () => this.initialMode() === Modes.AMEND });
	});

	readonly showLoadStatus = computed(() => this.loadStatusService.isLoadStatusApplicable(this.testResult()));
	readonly loadStatusRequired = computed(() => this.showLoadStatus() && this.initialMode() !== Modes.AMEND);
	vehicleLoadStatus = new SignalFormControl<VehicleLoadStatusType | null | undefined>(undefined, (path) => {
		required(path, { when: this.loadStatusRequired, message: 'Load status is required' });
	});
	private readonly unladenSelected = computed(
		() => this.vehicleLoadStatus.fieldTree().value() === VehicleLoadStatusType.UNLADEN
	);
	private readonly partiallyLadenSelected = computed(
		() => this.vehicleLoadStatus.fieldTree().value() === VehicleLoadStatusType.PARTIALLY_LADEN
	);
	unladenBodyType = new SignalFormControl<UnladenBodyType | null | undefined>(undefined, (path) => {
		required(path, { when: this.unladenSelected, message: 'Body type is required' });
	});
	reasonForNotLoading = new SignalFormControl<ReasonForNotLoading | null | undefined>(undefined, (path) => {
		required(path, { when: this.unladenSelected, message: 'Reason for not loading is required' });
	});
	otherUnladenBodyType = new SignalFormControl<string | null | undefined>(undefined, (path) => {
		const selected = () => this.unladenSelected() && this.unladenBodyType.fieldTree().value() === UnladenBodyType.OTHER;
		hidden(path, { when: () => !selected() });
		required(path, { when: selected, message: 'Enter body type is required' });
		validate(path, ({ value }) =>
			selected() && (value()?.length ?? 0) > 200
				? maxLengthError(200, { message: 'Enter body type must be less than or equal to 200 characters' })
				: undefined
		);
	});
	partiallyLadenReason = new SignalFormControl<string | null | undefined>(undefined, (path) => {
		required(path, { when: this.partiallyLadenSelected, message: 'Partially laden reason is required' });
		validate(path, ({ value }) =>
			this.partiallyLadenSelected() && (value()?.length ?? 0) > 200
				? maxLengthError(200, { message: 'Partially laden reason must be less than or equal to 200 characters' })
				: undefined
		);
	});
	otherReasonForNotLoading = new SignalFormControl<string | null | undefined>(undefined, (path) => {
		const selected = () =>
			this.unladenSelected() && this.reasonForNotLoading.fieldTree().value() === ReasonForNotLoading.OTHER;
		hidden(path, { when: () => !selected() });
		required(path, { when: selected, message: 'Enter reason for not loading is required' });
		validate(path, ({ value }) =>
			selected() && (value()?.length ?? 0) > 200
				? maxLengthError(200, { message: 'Enter reason for not loading must be less than or equal to 200 characters' })
				: undefined
		);
	});

	readonly vehicleType = new SignalFormControl<VehicleType>('car');

	// Form
	form = this.fb.group({
		testResultId: new SignalFormControl<string>(''),
		testStationName: this.testStationName,
		testStationPNumber: this.testStationPNumber,
		testStationType: this.testStationType,
		testerName: this.testerName,
		testerStaffId: this.testerStaffId,
		testerEmailAddress: this.testerEmailAddress,
		testStartTimestamp: this.testStartTimestamp,
		testEndTimestamp: this.testEndTimestamp,
		testStatus: new SignalFormControl<TestStatus>('submitted' as TestStatus),
		reasonForCancellation: new SignalFormControl<string | null>(null),
		systemNumber: new SignalFormControl<string>(''),
		vrm: new SignalFormControl<string | undefined>(undefined),
		trailerId: new SignalFormControl<string | undefined>(undefined),
		vin: new SignalFormControl<string>(''),
		vehicleClass: this.fb.group({
			code: new SignalFormControl<string>(''),
			description: new SignalFormControl<string>(''),
		}),
		vehicleSubclass: new SignalFormControl<string[] | undefined>(undefined),
		vehicleType: this.vehicleType,
		vehicleConfiguration: new SignalFormControl<string>(''),
		odometerReading: this.odometerReading,
		odometerReadingUnits: this.odometerReadingUnits,
		preparerId: new SignalFormControl<string | null>(null),
		preparerName: new SignalFormControl<string | null>(null),
		euVehicleCategory: this.euVehicleCategory,
		countryOfRegistration: this.countryOfRegistration,
		noOfAxles: new SignalFormControl<number | null>(null),
		numberOfWheelsDriven: new SignalFormControl<number | null>(null),
		vehicleSize: new SignalFormControl<string | undefined>(undefined),
		numberOfSeats: new SignalFormControl<number | undefined>(undefined),
		regnDate: new SignalFormControl<string | null | undefined>(undefined),
		firstUseDate: new SignalFormControl<string | null | undefined>(undefined),
		media: new SignalFormControl<MediaSchema[] | undefined>(undefined),
		reasonForCreation: this.reasonForCreation,
		createdAt: new SignalFormControl<string | null>(null),
		createdByEmailAddress: new SignalFormControl<string | undefined>(undefined),
		createdByName: new SignalFormControl<string>(''),
		createdById: new SignalFormControl<string>(''),
		lastUpdatedAt: new SignalFormControl<string | null>(null),
		lastUpdatedByEmailAddress: new SignalFormControl<string | undefined>(undefined),
		lastUpdatedByName: new SignalFormControl<string>(''),
		lastUpdatedById: new SignalFormControl<string>(''),
		contingencyTestNumber: this.contingencyTestNumber,
		typeOfTest: new SignalFormControl<TypeOfTest>('contingency' as TypeOfTest),
		source: new SignalFormControl<TestSources>('vtm' as TestSources),
		make: new SignalFormControl<string | null>(null),
		model: new SignalFormControl<string | null>(null),
		bodyType: this.fb.group({
			code: new SignalFormControl<string | null>(''),
			description: new SignalFormControl<string | null>(''),
		}),
		recalls: new SignalFormControl<RecallsSchema | null | undefined>(undefined),
		testTypes: this.fb.array([
			this.fb.group({
				testTypeName: this.testTypeName,
				name: this.fb.control<string>(''),
				testTypeId: this.fb.control<string>(''),
				certificateNumber: this.certificateNumber,
				secondaryCertificateNumber: this.fb.control<string | null>(null),
				testTypeStartTimestamp: this.testTypeStartTimestamp,
				testTypeEndTimestamp: this.testTypeEndTimestamp,
				testResult: this.fb.control<TestResults | null>(null),
				prohibitionIssued: this.fb.control<boolean | null>(null),
				reasonForAbandoning: this.fb.control<string | null>(null),
				additionalNotesRecorded: this.additionalNotesRecorded,
				additionalCommentsForAbandon: this.fb.control<string | null>(null),
				numberOfSeatbeltsFitted: this.numberOfSeatbeltsFitted,
				lastSeatbeltInstallationCheckDate: this.lastSeatbeltInstallationCheckDate,
				seatbeltInstallationCheckDate: this.seatbeltInstallationCheckDate,
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
				testNumber: this.testNumber,
				reapplicationDate: this.fb.control<string | null | undefined>({ value: undefined, disabled: false }),
				testCode: this.testCode,
				createdAt: this.testTypeCreatedAt,
				testTypeClassification: this.fb.control<string | null | undefined>({ value: undefined, disabled: false }),
				centralDocs: this.fb.group({
					issueRequired: this.fb.control<boolean>(false),
					notes: this.fb.control<string>(' '),
					reasonsForIssue: this.fb.control<string[]>([]),
				}),
				loadStatus: this.fb.group({
					vehicleLoadStatus: this.vehicleLoadStatus,
					unladenBodyType: this.unladenBodyType,
					otherUnladenBodyType: this.otherUnladenBodyType,
					reasonForNotLoading: this.reasonForNotLoading,
					partiallyLadenReason: this.partiallyLadenReason,
					otherReasonForNotLoading: this.otherReasonForNotLoading,
				}),
			}),
		]),
		vtg15: this.fb.group({
			vtg15Required: this.vtg15Required,
			primaryHazardClassification: this.primaryHazardClassification,
			secondaryHazardClassification: new SignalFormControl<HazardClassification | null | undefined>(undefined),
			unNumber: this.unNumber,
			media: new SignalFormControl<MediaSchema[] | null | undefined>([
				{ path: ' ', reason: 'Contingency test', type: 'failReason' },
			]),
		}),
	});

	constructor() {
		effect(() => {
			this.initialMode();
			// A change to a signal rule does not automatically recalculate the reactive parent.
			untracked(() => this.form.updateValueAndValidity({ emitEvent: false }));
		});
		effect(() => {
			this.certificateNumber.status;
			this.testTypeStartTimestamp.status;
			this.testTypeEndTimestamp.status;
			this.seatbeltInstallationCheckDate.status;
			this.numberOfSeatbeltsFitted.status;
			this.lastSeatbeltInstallationCheckDate.status;
			this.additionalNotesRecorded.status;
			this.testTypeName.status;
			this.testTypeCreatedAt.status;
			this.testCode.status;
			this.testNumber.status;
			untracked(() => this.certificateNumber.parent?.updateValueAndValidity({ emitEvent: false }));
		});
		effect(() => {
			this.odometerReading.status;
			this.odometerReadingUnits.status;
			this.countryOfRegistration.status;
			this.euVehicleCategory.status;
			this.contingencyTestNumber.status;
			untracked(() => this.form.updateValueAndValidity({ emitEvent: false }));
		});
		effect(() => {
			this.vtg15Required.status;
			this.primaryHazardClassification.status;
			this.unNumber.status;
			untracked(() => this.form.controls.vtg15.updateValueAndValidity({ emitEvent: false }));
		});
		effect(() => {
			this.vehicleLoadStatus.status;
			this.unladenBodyType.status;
			this.otherUnladenBodyType.status;
			this.reasonForNotLoading.status;
			this.partiallyLadenReason.status;
			this.otherReasonForNotLoading.status;
			untracked(() =>
				this.form.controls.testTypes.at(0).controls.loadStatus.updateValueAndValidity({ emitEvent: false })
			);
		});
		this.mirrorTimestamp(this.testTypeStartTimestamp, this.testStartTimestamp);
		this.mirrorTimestamp(this.testTypeEndTimestamp, this.testEndTimestamp);
	}

	resetForm(): void {
		// SignalFormControl.reset() can notify the reactive parent even with emitEvent: false.
		// Patch the complete default payload without waking the debounced store mirror.
		this.form.patchValue(INITIAL_TEST_RESULT_FORM_VALUE, { emitEvent: false });
		this.form.markAsPristine({ emitEvent: false });
		this.form.markAsUntouched({ emitEvent: false });
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
			loadStatus: {
				vehicleLoadStatus: null,
				unladenBodyType: null,
				otherUnladenBodyType: null,
				reasonForNotLoading: null,
				partiallyLadenReason: null,
				otherReasonForNotLoading: null,
			},
			centralDocs: {
				issueRequired: false,
				notes: ' ',
				reasonsForIssue: [],
			},
		},
	],
	vtg15: {
		vtg15Required: null,
		primaryHazardClassification: null,
		secondaryHazardClassification: null,
		unNumber: null,
		media: null,
	},
} satisfies ReturnType<TestService['form']['getRawValue']>;
