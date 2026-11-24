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
	TestResultSchema,
	TestSources,
	TestStationTypes,
	TestStatus,
	TypeOfTest,
	VehicleType,
} from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { VehicleTypes } from '../../models/vehicle-tech-record.model';

export interface CodeAndDescriptionFormModel {
	code: string | null;
	description: string | null;
}

/** An additional defect being entered; its name and notes are empty until the user types them. */
export interface CustomDefectFormModel
	extends Partial<Omit<SpecialistCustomDefectsSchema, 'defectName' | 'defectNotes'>> {
	defectName: string | null;
	defectNotes: string | null;
}

export interface TestTypeFormModel {
	testTypeName: string | null;
	name: string | null;
	testTypeId: string | null;
	certificateNumber: string | null;
	secondaryCertificateNumber: string | null;
	testTypeStartTimestamp: string | null;
	testTypeEndTimestamp: string | null;
	testResult: TestResults | null;
	prohibitionIssued: boolean | null;
	reasonForAbandoning: string | string[] | null;
	additionalNotesRecorded: string | null;
	additionalCommentsForAbandon: string | null;
	numberOfSeatbeltsFitted: number | null;
	lastSeatbeltInstallationCheckDate: string | null;
	seatbeltInstallationCheckDate: boolean | null;
	testExpiryDate: string | null;
	testAnniversaryDate: string | null;
	modType: ModTypeSchema | null;
	emissionStandard: EmissionStandards | null;
	fuelType: FuelType | null;
	modificationTypeUsed: string | null;
	smokeTestKLimitApplied: string | null;
	particulateTrapFitted: string | null;
	particulateTrapSerialNumber: string | null;
	defects: DefectDetailsSchema[];
	customDefects: CustomDefectFormModel[];
	requiredStandards: SpecialistCustomDefectsSchemaPut[] | null;
	testNumber: string | null;
	reapplicationDate: string | null;
	testCode: string | null;
	createdAt: string | null;
	testTypeClassification: string | null;
	centralDocs: {
		issueRequired: boolean | null;
		notes: string | null;
		reasonsForIssue: string[] | null;
	};
	loadStatus: {
		vehicleLoadStatus: VehicleLoadStatusType | null;
		unladenBodyType: UnladenBodyType | null;
		otherUnladenBodyType: string | null;
		reasonForNotLoading: ReasonForNotLoading | null;
		partiallyLadenReason: string | null;
		otherReasonForNotLoading: string | null;
	};
}

/**
 * The value edited by the test result signal form. Every field is present and absent values are `null`
 * (never `undefined`), so the field tree always has a node for each field. The API shape is produced by
 * {@link toTestResult}.
 */
export interface TestResultFormModel {
	testResultId: string;
	testStationName: string | null;
	testStationPNumber: string | null;
	testStationType: TestStationTypes | null;
	testerName: string | null;
	testerStaffId: string;
	testerEmailAddress: string | null;
	testStartTimestamp: string | null;
	testEndTimestamp: string | null;
	testStatus: TestStatus;
	reasonForCancellation: string | null;
	systemNumber: string;
	vrm: string | null;
	trailerId: string | null;
	vin: string;
	vehicleClass: CodeAndDescriptionFormModel;
	vehicleSubclass: string[] | null;
	vehicleType: VehicleType;
	vehicleConfiguration: string;
	odometerReading: number | null;
	odometerReadingUnits: OdometerReadingUnits | null;
	preparerId: string | null;
	preparerName: string | null;
	euVehicleCategory: EUVehicleCategory | null;
	countryOfRegistration: string | null;
	noOfAxles: number | null;
	numberOfWheelsDriven: number | null;
	vehicleSize: string | null;
	numberOfSeats: number | null;
	regnDate: string | null;
	firstUseDate: string | null;
	media: MediaSchema[] | null;
	approvalCertificate: MediaSchema[] | null;
	reasonForCreation: string;
	createdAt: string | null;
	createdByEmailAddress: string | null;
	createdByName: string;
	createdById: string;
	lastUpdatedAt: string | null;
	lastUpdatedByEmailAddress: string | null;
	lastUpdatedByName: string;
	lastUpdatedById: string;
	contingencyTestNumber: string | null;
	typeOfTest: TypeOfTest;
	source: TestSources;
	make: string | null;
	model: string | null;
	bodyType: CodeAndDescriptionFormModel;
	recalls: RecallsSchema | null;
	testTypes: TestTypeFormModel[];
	vtg15: {
		vtg15Required: boolean | null;
		primaryHazardClassification: HazardClassification | null;
		secondaryHazardClassification: HazardClassification | null;
		unNumber: string | null;
		media: MediaSchema[] | null;
	};
}

export function createInitialTestTypeFormModel(): TestTypeFormModel {
	return {
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
		numberOfSeatbeltsFitted: null,
		lastSeatbeltInstallationCheckDate: null,
		seatbeltInstallationCheckDate: null,
		testExpiryDate: null,
		testAnniversaryDate: '',
		modType: null,
		emissionStandard: null,
		fuelType: null,
		modificationTypeUsed: null,
		smokeTestKLimitApplied: null,
		particulateTrapFitted: null,
		particulateTrapSerialNumber: null,
		defects: [],
		customDefects: [],
		requiredStandards: null,
		testNumber: null,
		reapplicationDate: null,
		testCode: null,
		createdAt: null,
		testTypeClassification: null,
		centralDocs: { issueRequired: false, notes: ' ', reasonsForIssue: [] },
		loadStatus: {
			vehicleLoadStatus: null,
			unladenBodyType: null,
			otherUnladenBodyType: null,
			reasonForNotLoading: null,
			partiallyLadenReason: null,
			otherReasonForNotLoading: null,
		},
	};
}

export function createInitialTestResultFormModel(): TestResultFormModel {
	return {
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
		vrm: null,
		trailerId: null,
		vin: '',
		vehicleClass: { code: '', description: '' },
		vehicleSubclass: null,
		vehicleType: 'car' as VehicleType,
		vehicleConfiguration: '',
		odometerReading: null,
		odometerReadingUnits: null,
		preparerId: null,
		preparerName: null,
		euVehicleCategory: null,
		countryOfRegistration: null,
		noOfAxles: null,
		numberOfWheelsDriven: null,
		vehicleSize: null,
		numberOfSeats: null,
		regnDate: null,
		firstUseDate: null,
		media: null,
		approvalCertificate: null,
		reasonForCreation: '',
		createdAt: null,
		createdByEmailAddress: null,
		createdByName: '',
		createdById: '',
		lastUpdatedAt: null,
		lastUpdatedByEmailAddress: null,
		lastUpdatedByName: '',
		lastUpdatedById: '',
		contingencyTestNumber: null,
		typeOfTest: 'contingency' as TypeOfTest,
		source: 'vtm' as TestSources,
		make: null,
		model: null,
		bodyType: { code: '', description: '' },
		recalls: null,
		testTypes: [createInitialTestTypeFormModel()],
		vtg15: {
			vtg15Required: null,
			primaryHazardClassification: null,
			secondaryHazardClassification: null,
			unNumber: null,
			media: null,
		},
	};
}

// Fields the API omits rather than nulls when they have no value.
const OMITTED_WHEN_EMPTY = new Set<string>([
	'vrm',
	'trailerId',
	'vehicleSubclass',
	'odometerReading',
	'odometerReadingUnits',
	'vehicleSize',
	'numberOfSeats',
	'regnDate',
	'firstUseDate',
	'media',
	'approvalCertificate',
	'createdByEmailAddress',
	'lastUpdatedByEmailAddress',
	'recalls',
]);
const TEST_TYPE_OMITTED_WHEN_EMPTY = new Set<string>([
	'numberOfSeatbeltsFitted',
	'lastSeatbeltInstallationCheckDate',
	'seatbeltInstallationCheckDate',
	'testExpiryDate',
	'modType',
	'emissionStandard',
	'fuelType',
	'modificationTypeUsed',
	'smokeTestKLimitApplied',
	'particulateTrapFitted',
	'particulateTrapSerialNumber',
	'requiredStandards',
	'testNumber',
	'reapplicationDate',
	'testCode',
	'createdAt',
	'testTypeClassification',
]);
const GROUPS = new Set<string>(['vehicleClass', 'bodyType', 'vtg15']);
const TEST_TYPE_GROUPS = new Set<string>(['centralDocs', 'loadStatus']);

type Patchable = Record<string, unknown>;

/** Signal Forms tags array items with tracking symbols, so values crossing the form boundary are always copied. */
function toModelValue(value: unknown): unknown {
	return value === undefined ? null : structuredClone(value);
}

function patchLeaves<T extends object>(current: T, value: unknown, groups: Set<string> = new Set()): T {
	if (value == null || typeof value !== 'object') return current;
	const patch = value as Patchable;
	const next = { ...current } as Patchable;
	for (const key of Object.keys(current)) {
		if (!(key in patch)) continue;
		next[key] = groups.has(key) ? patchLeaves(next[key] as object, patch[key]) : toModelValue(patch[key]);
	}
	return next as T;
}

/**
 * Applies a (partial) test result to the form model with the same semantics as `FormGroup.patchValue`:
 * only fields present in the value change, and `undefined` becomes `null`. Existing objects are spread, so
 * Signal Forms keeps the identity of the test type field.
 */
export function patchTestResultFormModel(current: TestResultFormModel, value: unknown): TestResultFormModel {
	const next = patchLeaves(current, value, GROUPS);
	// Legacy records can contain a numeric UN number despite the API's string type.
	const unNumber: unknown = next.vtg15.unNumber;
	if (typeof unNumber === 'number') next.vtg15.unNumber = String(unNumber);
	const testTypes = (value as Partial<TestResultSchema> | null)?.testTypes;
	if (Array.isArray(testTypes)) {
		next.testTypes = current.testTypes.map((testType, index) => {
			const patched = patchLeaves(testType, testTypes[index], TEST_TYPE_GROUPS);
			return { ...patched, customDefects: patched.customDefects ?? [], defects: patched.defects ?? [] };
		});
	} else {
		next.testTypes = current.testTypes;
	}
	return next;
}

function omitEmpty(value: Patchable, keys: Set<string>): void {
	for (const key of keys) {
		if (value[key] === null) value[key] = undefined;
	}
}

/** Converts the form model to the test result shape held in the store and sent to the API. */
export function toTestResult(model: TestResultFormModel): TestResultSchema {
	const value = structuredClone(model) as unknown as Patchable;
	omitEmpty(value, OMITTED_WHEN_EMPTY);
	for (const testType of value['testTypes'] as Patchable[]) {
		omitEmpty(testType, TEST_TYPE_OMITTED_WHEN_EMPTY);
	}
	// The API expects the timestamps at both levels of the test result, so the root mirrors the test type (even when cleared).
	const [testType] = model.testTypes;
	if (testType) {
		value['testStartTimestamp'] = testType.testTypeStartTimestamp || undefined;
		value['testEndTimestamp'] = testType.testTypeEndTimestamp || undefined;
	}

	// The API expects seatbelt installation information even on voluntary tests where its not captured
	if (model.vehicleType === VehicleTypes.PSV) {
		(value['testTypes'] as Patchable[])[0]['numberOfSeatbeltsFitted'] = testType['numberOfSeatbeltsFitted'] ?? null;
		(value['testTypes'] as Patchable[])[0]['lastSeatbeltInstallationCheckDate'] =
			testType['lastSeatbeltInstallationCheckDate'] ?? null;
		(value['testTypes'] as Patchable[])[0]['seatbeltInstallationCheckDate'] =
			testType['seatbeltInstallationCheckDate'] ?? null;
	}

	// The API expects odometer reading and odometer reading units to be defined on non-TRLs
	if (model.vehicleType !== VehicleTypes.TRL) {
		value['odometerReading'] = model.odometerReading ?? null;
		value['odometerReadingUnits'] = model.odometerReadingUnits ?? null;
	}

	return value as unknown as TestResultSchema;
}
