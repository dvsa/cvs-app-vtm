import { FuelType } from '@dvsa/cvs-type-definitions/types/v1/enums/fuelType.enum';
import { TestResults } from '@dvsa/cvs-type-definitions/types/v1/enums/testResult.enum.js';
import { DefectDetailsSchema, SpecialistCustomDefectsSchemaPut } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import * as Emissions from './emissions.enum';

export interface TestType {
	testTypeId: string;
	testNumber: string;
	name: string;
	testCode?: string;
	testTypeName: string;

	testTypeStartTimestamp: string | Date;
	testTypeEndTimestamp: string | Date;
	testExpiryDate: string | Date;

	certificateNumber: string;
	reasonForAbandoning: string | null;
	additionalCommentsForAbandon?: string | null;
	testAnniversaryDate: string | Date;
	prohibitionIssued: boolean | null;

	testResult: TestResults;

	seatbeltInstallationCheckDate: boolean;
	numberOfSeatbeltsFitted: number;
	lastSeatbeltInstallationCheckDate: string | Date | null;
	emissionStandard: Emissions.EmissionStandard;
	smokeTestKLimitApplied: string;
	fuelType: FuelType;
	modType: Emissions.ModType;
	modificationTypeUsed: string;
	particulateTrapFitted: string;
	particulateTrapSerialNumber: string;
	defects?: DefectDetailsSchema[];
	requiredStandards?: SpecialistCustomDefectsSchemaPut[];
	customDefects: CustomDefects[];

	additionalNotesRecorded: string;
	certificateLink?: string | null;
	deletionFlag?: boolean;
	secondaryCertificateNumber?: string | null;
	reapplicationDate?: string;

	centralDocs?: CentralDocs;
}

export interface CentralDocs {
	issueRequired: boolean;
	notes?: string;
	reasonsForIssue?: string[];
}

export interface CustomDefects {
	referenceNumber?: string;
	defectName: string;
	defectNotes: string;
}

export enum resultOfTestEnum {
	fail = 'fail',
	prs = 'prs',
	pass = 'pass',
	abandoned = 'abandoned',
}
