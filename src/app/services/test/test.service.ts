import { Injectable, computed, effect, inject, signal, untracked } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
	SchemaFn,
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
	TEST_TYPES_GROUP1,
	TEST_TYPES_GROUP1_DESK_BASED_TEST,
	TEST_TYPES_GROUP1_SPEC_TEST,
	TEST_TYPES_GROUP2,
	TEST_TYPES_GROUP2_DESK_BASED_TEST,
	TEST_TYPES_GROUP3_4_8,
	TEST_TYPES_GROUP3_DESK_BASED_TEST,
	TEST_TYPES_GROUP4_DESK_BASED_TEST,
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

const START_TIMESTAMP_LABEL = 'Test start date and time';
const END_TIMESTAMP_LABEL = 'Test end date and time';

// Signal Forms may attach identity symbols to array items; keep store data and form values separate.
class DetachedSignalFormControl<T> extends SignalFormControl<T> {
	constructor(value: T, schema?: SchemaFn<T>) {
		super(structuredClone(value), schema);
	}

	override setValue(value: T, options?: Parameters<SignalFormControl<T>['setValue']>[1]): void {
		super.setValue(structuredClone(value), options);
	}

	override patchValue(value: T, options?: Parameters<SignalFormControl<T>['patchValue']>[1]): void {
		super.patchValue(structuredClone(value), options);
	}

	override getRawValue(): T {
		return structuredClone(super.getRawValue());
	}
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

export function customDefectFieldError(value: string | null | undefined, label: string, limit: number) {
	if (!value) return { kind: 'required', message: `${label} is required` };
	if (value.length > limit) {
		return { kind: 'maxLength', message: `${label} must be less than or equal to ${limit} characters` };
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
	readonly isEditing = computed(() => this.mode() === Modes.EDIT || this.mode() === Modes.AMEND);
	private readonly store = inject(Store);
	private readonly loadStatusService = inject(LoadStatusService);
	private readonly testResult = this.store.selectSignal(toEditOrNotToEdit);
	private readonly oldSpecialist = this.store.selectSignal(isTestTypeOldIvaOrMsva);
	private readonly techRecord = this.store.selectSignal(techRecord);
	private readonly hasOdometer = computed(() => {
		const vehicle = this.techRecord();
		return !!vehicle && vehicle.techRecord_vehicleType !== VehicleTypes.TRL;
	});
	readonly isTestTypeGroup7 = computed(() =>
		TEST_TYPES_GROUP7.includes(this.testResult()?.testTypes[0].testTypeId ?? '')
	);
	private readonly group5or13 = computed(() =>
		TEST_TYPES_GROUP5_13.includes(this.testResult()?.testTypes[0].testTypeId ?? '')
	);
	private readonly group12or14 = computed(() =>
		TEST_TYPES_GROUP12_14.includes(this.testResult()?.testTypes[0].testTypeId ?? '')
	);
	readonly isTestTypeGroup3And4And8 = computed(() =>
		TEST_TYPES_GROUP3_4_8.includes(this.testResult()?.testTypes?.[0]?.testTypeId ?? '')
	);
	readonly isSpecialistGroup1 = computed(() =>
		TEST_TYPES_GROUP1_SPEC_TEST.includes(this.testResult()?.testTypes?.[0]?.testTypeId ?? '')
	);
	private readonly showResult = computed(
		() => this.isTestTypeGroup7() || this.isSpecialistGroup1() || this.group5or13() || this.isTestTypeGroup3And4And8()
	);
	// These templates record no expiry or anniversary date in any mode.
	private readonly withoutTestDates = computed(
		() => this.isSpecialistGroup1() || this.group5or13() || this.isTestTypeGroup3And4And8()
	);
	readonly additionalNotesLabel = computed(() =>
		this.isTestTypeGroup7() ? 'Additional Notes' : 'Additional Notes (optional)'
	);
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

		if (hgvOrTrl && this.isTestTypeGroup7()) {
			// ADR amendments can retain a manually entered number for PRS or abandoned tests.
			const visible = amending
				? outcome === TestResults.ABANDONED || (passedOrPrs && !issuedCentrally)
				: passed && !issuedCentrally;
			return { ...optional, visible, requiredWithResult: passed && !issuedCentrally };
		}
		if (hgvOrTrl && !amending && this.group5or13()) {
			const visible = passed && !issuedCentrally;
			return { ...optional, visible, requiredWithResult: visible };
		}
		if ((psv || vehicle === VehicleTypes.HGV) && TEST_TYPES_GROUP15_16.includes(testTypeId)) {
			return { ...optional, visible: !(amending && passedOrPrs && issuedCentrally), required: true };
		}

		if ((hgvOrTrl || psv || lightVehicle || motorcycle) && this.isSpecialistGroup1()) {
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
	private readonly certificateNumberVisible = computed(() => {
		const mode = this.mode();
		if (mode !== Modes.VIEW && mode !== Modes.SUMMARY) return this.certificateNumberRules().visible;

		const outcome = this.testResult()?.testTypes[0].testResult;
		if (mode === Modes.SUMMARY && this.isTestTypeGroup7()) return true;
		if (mode === Modes.SUMMARY && this.initialMode() === Modes.EDIT && this.group5or13()) {
			return outcome !== TestResults.FAIL;
		}
		return (
			this.isSpecialistGroup1() &&
			(outcome === TestResults.PASS || outcome === TestResults.PRS) &&
			this.certificateNumberRules().visible
		);
	});

	/**
	 * Define individual signal form controls here, then reference in the form.
	 * Once all controls have been migrated, the form can use a single signal and
	 * the Angular form() helper instead.
	 */
	reasonForCreation = new SignalFormControl<string>('', (schema) => {
		required(schema, {
			message: 'Reason for creation is required',
			when: () => this.initialMode() === Modes.EDIT || this.initialMode() === Modes.AMEND,
		});
		maxLength(schema, 100, { message: 'Reason for creation must be less than or equal to 100 characters' });
	});

	odometerReading = new SignalFormControl<number | null | undefined>(undefined, (schema) => {
		hidden(schema, { when: () => !this.hasOdometer() });
		applyWhen(
			schema,
			() => !this.isAbandoning() && !this.isSpecialistGroup1() && (!this.recordedAsAbandoned() || this.group12or14()),
			(path) => required(path, { message: 'Odometer Reading is required' })
		);
		applyWhen(
			schema,
			() => {
				if (!this.requireOdometerPair() || !this.isSpecialistGroup1()) return false;
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
			() => this.requireOdometerPair() && !this.isSpecialistGroup1(),
			(path) => required(path, { message: 'Odometer Reading Units is required' })
		);
		applyWhen(
			schema,
			() => this.requireOdometerPair() && this.isSpecialistGroup1() && this.odometerReading.fieldTree().value() != null,
			(path) => required(path, { message: 'Odometer Reading Units is required with Odometer Reading' })
		);
	});

	certificateNumber = new SignalFormControl<string | null>(null, (schema) => {
		hidden(schema, { when: () => !this.certificateNumberVisible() });
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

	contingencyTestNumber = new SignalFormControl<string | null>(null, (path) => {
		hidden(path, { when: () => this.mode() !== Modes.EDIT && this.initialMode() !== Modes.EDIT });
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

	private readonly vtg15Applicable = computed(() => {
		const record = this.techRecord();
		return !!record && isAdrVehicle(record);
	});
	vtg15Required = new SignalFormControl<boolean | null | undefined>(undefined, (path) => {
		hidden(path, { when: () => !this.vtg15Applicable() });
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
	private readonly vtg15Selected = computed(
		() => this.vtg15Applicable() && this.vtg15Required.fieldTree().value() === true
	);
	primaryHazardClassification = new SignalFormControl<HazardClassification | null | undefined>(undefined, (path) => {
		hidden(path, { when: () => !this.vtg15Selected() });
		required(path, { when: this.vtg15Selected, message: 'Primary hazard classification is required' });
	});
	secondaryHazardClassification = new SignalFormControl<HazardClassification | null | undefined>(undefined, (path) => {
		hidden(path, { when: () => !this.vtg15Selected() });
	});
	unNumber = new SignalFormControl<string | null | undefined>(undefined, (path) => {
		hidden(path, { when: () => !this.vtg15Selected() });
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
		return result?.vehicleType === VehicleTypes.PSV && !this.isSpecialistGroup1() && !this.isTestTypeGroup3And4And8();
	});
	seatbeltInstallationCheckDate = new SignalFormControl<boolean | null | undefined>(undefined, (path) => {
		hidden(path, { when: () => !this.seatbeltApplicable() });
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
		hidden(path, { when: () => !this.seatbeltApplicable() });
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
		hidden(path, { when: () => !this.seatbeltApplicable() });
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
			return maxLengthError(500, {
				message: `${this.additionalNotesLabel()} must be less than or equal to 500 characters`,
			});
		});
	});

	private readonly testTypeNameDisabled = computed(() => {
		return this.initialMode() === Modes.AMEND || this.showResult();
	});
	private readonly amendmentMetadataVisible = computed(
		() =>
			(this.mode() === Modes.AMEND && !this.isSpecialistGroup1()) ||
			this.mode() === Modes.VIEW ||
			(this.mode() === Modes.SUMMARY && this.initialMode() === Modes.AMEND)
	);
	testTypeName = new SignalFormControl<string | null>(null, (path) => {
		disabled(path, { when: this.testTypeNameDisabled });
		hidden(path, {
			when: () =>
				!this.showResult() &&
				this.mode() !== Modes.AMEND &&
				this.mode() !== Modes.VIEW &&
				!(this.mode() === Modes.SUMMARY && this.initialMode() === Modes.AMEND),
		});
	});
	testTypeCreatedAt = new SignalFormControl<string | null | undefined>(undefined, (path) => {
		disabled(path, { when: () => this.initialMode() === Modes.AMEND });
		hidden(path, { when: () => !this.amendmentMetadataVisible() });
	});
	testCode = new SignalFormControl<string | null | undefined>(undefined, (path) => {
		disabled(path, { when: () => this.initialMode() === Modes.AMEND });
		hidden(path, { when: () => !this.amendmentMetadataVisible() });
	});
	testNumber = new SignalFormControl<string | null | undefined>(undefined, (path) => {
		disabled(path, { when: () => this.initialMode() === Modes.AMEND });
		hidden(path, { when: () => !this.amendmentMetadataVisible() });
	});

	private readonly showLoadStatus = computed(() => this.loadStatusService.isLoadStatusApplicable(this.testResult()));
	readonly loadStatusRequired = computed(() => this.showLoadStatus() && this.initialMode() !== Modes.AMEND);
	vehicleLoadStatus = new SignalFormControl<VehicleLoadStatusType | null | undefined>(undefined, (path) => {
		hidden(path, { when: () => !this.showLoadStatus() });
		required(path, { when: this.loadStatusRequired, message: 'Load status is required' });
	});
	private readonly unladenSelected = computed(
		() => this.showLoadStatus() && this.vehicleLoadStatus.fieldTree().value() === VehicleLoadStatusType.UNLADEN
	);
	private readonly partiallyLadenSelected = computed(
		() => this.showLoadStatus() && this.vehicleLoadStatus.fieldTree().value() === VehicleLoadStatusType.PARTIALLY_LADEN
	);
	unladenBodyType = new SignalFormControl<UnladenBodyType | null | undefined>(undefined, (path) => {
		hidden(path, { when: () => !this.unladenSelected() });
		required(path, { when: this.unladenSelected, message: 'Body type is required' });
	});
	reasonForNotLoading = new SignalFormControl<ReasonForNotLoading | null | undefined>(undefined, (path) => {
		hidden(path, { when: () => !this.unladenSelected() });
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
		hidden(path, { when: () => !this.partiallyLadenSelected() });
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

	requiredStandards = new DetachedSignalFormControl<SpecialistCustomDefectsSchemaPut[] | null | undefined>(
		undefined,
		(path) => hidden(path, { when: () => !this.isSpecialistGroup1() })
	);
	testOutcome = new SignalFormControl<TestResults | null>(null, (path) => {
		hidden(path, { when: () => !this.showResult() });
		validate(path, ({ value }) => {
			if (!this.isSpecialistGroup1()) return undefined;
			const standards = this.requiredStandards.fieldTree().value();
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
	});
	prohibitionIssued = new SignalFormControl<boolean | null>(null, (path) => {
		hidden(path, { when: () => !this.showResult() });
		validate(path, ({ value }) =>
			this.showResult() && value() == null ? requiredError({ message: 'Prohibition issued is required' }) : undefined
		);
	});
	private readonly showExpiryDate = computed(() => {
		const result = this.testResult()?.testTypes[0].testResult;
		return (
			this.isTestTypeGroup7() &&
			this.mode() !== Modes.ABANDON &&
			result !== TestResults.ABANDONED &&
			result !== TestResults.FAIL
		);
	});
	private readonly showAnniversaryDate = computed(
		() => !this.isTestTypeGroup7() && !this.withoutTestDates() && !this.group12or14()
	);
	private readonly showReapplicationDate = computed(
		() => this.isSpecialistGroup1() && this.testResult()?.testTypes[0].testResult === TestResults.FAIL
	);
	testExpiryDate = new SignalFormControl<string | null | undefined>(undefined, (path) => {
		hidden(path, {
			when: () => {
				const mode = this.mode();
				if (mode === Modes.VIEW || (mode === Modes.SUMMARY && this.initialMode() === Modes.AMEND)) {
					return this.withoutTestDates();
				}
				if (mode === Modes.SUMMARY && this.initialMode() === Modes.EDIT) return !this.isTestTypeGroup7();
				return !(this.showExpiryDate() || (mode === Modes.AMEND && !this.withoutTestDates() && !this.group12or14()));
			},
		});
		required(path, {
			when: () =>
				(this.mode() === Modes.AMEND &&
					this.testOutcome.fieldTree().value() === TestResults.PASS &&
					this.showAnniversaryDate()) ||
				this.showExpiryDate(),
			message: 'Expiry Date is required',
		});
		validate(path, ({ value }) => this.dateAfterStartError(value(), 'Expiry Date'));
		validate(path, ({ value }) =>
			this.isTestTypeGroup7() && this.mode() === Modes.EDIT ? futureDateError(value(), 'Expiry Date') : undefined
		);
	});
	testAnniversaryDate = new SignalFormControl<string | null | undefined>(undefined, (path) => {
		hidden(path, {
			when: () => {
				const mode = this.mode();
				if (mode === Modes.VIEW || (mode === Modes.SUMMARY && this.initialMode() === Modes.AMEND)) {
					return this.withoutTestDates();
				}
				return mode !== Modes.AMEND || !this.showAnniversaryDate();
			},
		});
		required(path, {
			when: () =>
				this.mode() === Modes.AMEND &&
				this.testOutcome.fieldTree().value() === TestResults.PASS &&
				this.showAnniversaryDate(),
			message: 'Anniversary date is required',
		});
		validate(path, ({ value }) => this.dateAfterStartError(value(), 'Anniversary date'));
	});
	reapplicationDate = new SignalFormControl<string | null | undefined>(undefined, (path) => {
		hidden(path, { when: () => !this.showReapplicationDate() });
		required(path, { when: this.showReapplicationDate, message: 'Reapplication date is required' });
		validate(path, ({ value }) => {
			const date = value();
			if (!this.showReapplicationDate() || !date) return undefined;
			const error = dateError(date, 'Reapplication date');
			return error ? { kind: 'invalidDate', message: error } : futureDateError(date, 'Reapplication date');
		});
	});
	// Mirrors the amend templates (master.template.ts) that define the abandonment fields with
	// RequiredIfEquals on testResult. Vehicle and group pairs without a dedicated template use the
	// default section, which has no abandonment fields, so nothing is enforced for them.
	private readonly amendAbandonDetailsEnforced = computed(() => {
		const result = this.testResult();
		const testTypeId = result?.testTypes?.[0]?.testTypeId ?? '';
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
	private readonly amendingAbandonedTest = computed(
		() => this.mode() === Modes.AMEND && this.recordedAsAbandoned() && this.amendAbandonDetailsEnforced()
	);
	reasonForAbandoning = new SignalFormControl<string | string[] | null>(null, (path) => {
		hidden(path, { when: () => this.mode() !== Modes.ABANDON && !this.recordedAsAbandoned() });
		validate(path, ({ value }) => {
			const reason = value();
			const empty = !reason || (Array.isArray(reason) && reason.length === 0);
			if (!empty) return undefined;
			if (this.mode() === Modes.ABANDON) return requiredError({ message: 'Why was this test abandoned? is required' });
			return this.amendingAbandonedTest()
				? requiredError({ message: 'Reason for abandoning is required with Result' })
				: undefined;
		});
	});
	additionalCommentsForAbandon = new SignalFormControl<string | null>(null, (path) => {
		hidden(path, { when: () => this.mode() !== Modes.ABANDON && !this.recordedAsAbandoned() });
		validate(path, ({ value }) => {
			const notes = value();
			const id = this.testResult()?.testTypes[0].testTypeId ?? '';
			if (this.mode() === Modes.ABANDON) {
				if (this.isSpecialistGroup1() || TEST_TYPES_GROUP5_SPEC_TEST.includes(id)) {
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
	});
	customDefects = new DetachedSignalFormControl<SpecialistCustomDefectsSchema[] | null | undefined>([], (path) => {
		hidden(path, { when: () => !this.isSpecialistGroup1() });
		validate(path, ({ value }) => {
			if (!this.isSpecialistGroup1()) return undefined;
			const errors = (value() ?? []).flatMap((defect, index) =>
				(
					[
						['defectName', 'Defect Name', 200],
						['defectNotes', 'Defect Notes', 500],
					] as const
				).flatMap(([key, label, limit]) => {
					const error = customDefectFieldError(defect[key], label, limit);
					return error ? [{ error: error.message, anchorLink: `${key}-${index}` }] : [];
				})
			);
			return errors.length ? { kind: 'customDefects', message: errors[0].error, details: errors } : undefined;
		});
	});

	readonly vehicleType = new SignalFormControl<VehicleType>('car');
	private readonly showCentralDocs = computed(() => {
		const test = this.testResult()?.testTypes[0];
		if (this.isSpecialistGroup1() || this.group5or13()) {
			return test?.testResult === TestResults.PASS || test?.testResult === TestResults.PRS;
		}
		return (
			(this.isTestTypeGroup7() || TEST_TYPES_GROUP9_10_CENTRAL_DOCS.includes(test?.testTypeId ?? '')) &&
			test?.testResult !== TestResults.FAIL
		);
	});
	centralDocsIssueRequired = new SignalFormControl<boolean | null>(false, (path) => {
		hidden(path, { when: () => !this.showCentralDocs() });
	});
	defects = new DetachedSignalFormControl<DefectDetailsSchema[]>([], (path) => {
		hidden(path, { when: this.showResult });
	});

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
		vehicleSubclass: new DetachedSignalFormControl<string[] | undefined>(undefined),
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
		media: new DetachedSignalFormControl<MediaSchema[] | undefined>(undefined),
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
		recalls: new DetachedSignalFormControl<RecallsSchema | null | undefined>(undefined),
		testTypes: this.fb.array([
			this.fb.group({
				testTypeName: this.testTypeName,
				name: new SignalFormControl<string | null>(''),
				testTypeId: new SignalFormControl<string | null>(''),
				certificateNumber: this.certificateNumber,
				secondaryCertificateNumber: new SignalFormControl<string | null>(null),
				testTypeStartTimestamp: this.testTypeStartTimestamp,
				testTypeEndTimestamp: this.testTypeEndTimestamp,
				testResult: this.testOutcome,
				prohibitionIssued: this.prohibitionIssued,
				reasonForAbandoning: this.reasonForAbandoning,
				additionalNotesRecorded: this.additionalNotesRecorded,
				additionalCommentsForAbandon: this.additionalCommentsForAbandon,
				numberOfSeatbeltsFitted: this.numberOfSeatbeltsFitted,
				lastSeatbeltInstallationCheckDate: this.lastSeatbeltInstallationCheckDate,
				seatbeltInstallationCheckDate: this.seatbeltInstallationCheckDate,
				testExpiryDate: this.testExpiryDate,
				testAnniversaryDate: this.testAnniversaryDate,
				modType: new DetachedSignalFormControl<ModTypeSchema | null | undefined>(undefined),
				emissionStandard: new SignalFormControl<EmissionStandards | null | undefined>(undefined),
				fuelType: new SignalFormControl<FuelType | null | undefined>(undefined),
				modificationTypeUsed: new SignalFormControl<string | null | undefined>(undefined),
				smokeTestKLimitApplied: new SignalFormControl<string | null | undefined>(undefined),
				particulateTrapFitted: new SignalFormControl<string | null | undefined>(undefined),
				particulateTrapSerialNumber: new SignalFormControl<string | null | undefined>(undefined),
				defects: this.defects,
				customDefects: this.customDefects,
				requiredStandards: this.requiredStandards,
				testNumber: this.testNumber,
				reapplicationDate: this.reapplicationDate,
				testCode: this.testCode,
				createdAt: this.testTypeCreatedAt,
				testTypeClassification: new SignalFormControl<string | null | undefined>(undefined),
				centralDocs: this.fb.group({
					issueRequired: this.centralDocsIssueRequired,
					notes: new SignalFormControl<string | null>(' '),
					reasonsForIssue: new DetachedSignalFormControl<string[] | null>([]),
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
			secondaryHazardClassification: this.secondaryHazardClassification,
			unNumber: this.unNumber,
			media: new DetachedSignalFormControl<MediaSchema[] | null | undefined>([
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
			this.testOutcome.status;
			this.prohibitionIssued.status;
			this.testExpiryDate.status;
			this.testAnniversaryDate.status;
			this.reapplicationDate.status;
			this.reasonForAbandoning.status;
			this.additionalCommentsForAbandon.status;
			this.customDefects.status;
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

	private dateAfterStartError(value: string | null | undefined, label: string) {
		if (!value) return undefined;
		const error = dateError(value, label);
		if (error) return { kind: 'invalidDate', message: error };
		const start = this.testTypeStartTimestamp.fieldTree();
		const startValue = start.value();
		if (!startValue || !start.valid()) return undefined;
		const startDate = dayjs(startValue);
		const date = dayjs(value);
		return date.isValid() && startDate.isValid() && date.isBefore(startDate)
			? { kind: 'aheadOfDate', message: `${label} must be ahead of Start Time (${startDate.format('DD/MM/YYYY')})` }
			: undefined;
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
