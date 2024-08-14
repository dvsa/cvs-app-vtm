import { TestResultDefects } from '@models/test-results/test-result-defects.model';
import { TestResultRequiredStandard } from '@models/test-results/test-result-required-standard.model';
import * as Emissions from './emissions.enum';

export interface TestType {
	testTypeId: string;
	testNumber: string;
	name: string;
	testCode: string;
	testTypeName: string;

	testTypeStartTimestamp: string | Date;
	testTypeEndTimestamp: string | Date;
	testExpiryDate: string | Date;

	certificateNumber: string;
	reasonForAbandoning: string | null;
	additionalCommentsForAbandon?: string | null;
	testAnniversaryDate: string | Date;
	prohibitionIssued: boolean | null;

	testResult: resultOfTestEnum;

	seatbeltInstallationCheckDate: boolean;
	numberOfSeatbeltsFitted: number;
	lastSeatbeltInstallationCheckDate: string | Date | null;
	emissionStandard: Emissions.EmissionStandard;
	smokeTestKLimitApplied: string;
	fuelType: Emissions.FuelType;
	modType: Emissions.ModType;
	modificationTypeUsed: string;
	particulateTrapFitted: string;
	particulateTrapSerialNumber: string;
	defects?: TestResultDefects;
	requiredStandards?: TestResultRequiredStandard[];
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
