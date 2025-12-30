import { FuelType } from '@dvsa/cvs-type-definitions/types/v1/enums/fuelType.enum.js';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { EmissionStandards, TestResultTestTypeSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { ModTypeCode, ModeTypeDescription } from '@models/test-types/emissions.enum';

export const createMockTestType = (params: Partial<TestResultTestTypeSchema> = {}): TestResultTestTypeSchema => ({
	testTypeId: 'testTypeId',
	testNumber: 'testNumber',
	name: 'testName',
	testCode: 'testCode',
	testTypeName: 'testTypeName',
	testTypeStartTimestamp: '',
	testTypeEndTimestamp: '',
	testExpiryDate: '',
	certificateNumber: '',
	reasonForAbandoning: '',
	testAnniversaryDate: 'testAnniversaryDate',
	prohibitionIssued: false,
	testResult: TestResults.FAIL,
	seatbeltInstallationCheckDate: false,
	numberOfSeatbeltsFitted: 0,
	lastSeatbeltInstallationCheckDate: '',
	emissionStandard: 'Euro 3' as EmissionStandards,
	smokeTestKLimitApplied: 'smokeTestKLimitApplied',
	fuelType: FuelType.DIESEL,
	modificationTypeUsed: 'modificationTypeUsed',
	particulateTrapFitted: 'particulateTrapFitted',
	particulateTrapSerialNumber: 'particulateTrapSerialNumber',
	secondaryCertificateNumber: null,
	additionalCommentsForAbandon: null,
	modType: {
		code: ModTypeCode.g,
		description: ModeTypeDescription.Engine,
	},
	defects: [],
	customDefects: [],
	additionalNotesRecorded: '',
	requiredStandards: [
		{
			sectionNumber: 'string',
			sectionDescription: 'string',
			rsNumber: 1,
			requiredStandard: 'string',
			refCalculation: 'string',
			additionalInfo: false,
			inspectionTypes: ['basic'],
			prs: false,
			additionalNotes: 'string',
		},
	],
	...params,
});
