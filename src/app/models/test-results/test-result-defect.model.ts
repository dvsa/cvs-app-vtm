import { DefectAdditionalInformation } from './defectAdditionalInformation';

export interface TestResultDefect {
	imNumber?: number;
	imDescription?: string;
	additionalInformation?: DefectAdditionalInformation;
	itemNumber?: number;
	itemDescription?: string;
	deficiencyRef?: string;
	deficiencyId?: string;
	deficiencySubId?: string;
	deficiencyCategory: DeficiencyCategoryStringEnum;
	deficiencyText?: string;
	stdForProhibition?: boolean;
	prs?: boolean;
	prohibitionIssued?: boolean;
}

export type DeficiencyCategoryStringEnum = 'advisory' | 'dangerous' | 'major' | 'minor';
export const DeficiencyCategoryEnum = {
	Advisory: 'advisory' as DeficiencyCategoryStringEnum,
	Dangerous: 'dangerous' as DeficiencyCategoryStringEnum,
	Major: 'major' as DeficiencyCategoryStringEnum,
	Minor: 'minor' as DeficiencyCategoryStringEnum,
};
