import { DefectDetailsSchema, DefectLocationSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { DeficiencyCategoryEnum } from '../app/models/test-results/test-result-defect.model';

export const mockDefectList = (numberOfDefects = 1) => new Array(numberOfDefects).fill(0).map((_, i) => mockDefect(i));

export const mockDefect = (i = 0): DefectDetailsSchema => ({
	deficiencyRef: `DeficiencyRef${i}`,
	deficiencyCategory: DeficiencyCategoryEnum.Dangerous,
	deficiencyId: 'deficiency ID',
	deficiencySubId: 'deficiency sub ID',
	deficiencyText: 'deficiency text',
	imDescription: 'IM description',
	imNumber: 34,
	itemDescription: 'item description',
	itemNumber: 6,
	prohibitionIssued: false,
	prs: false,
	stdForProhibition: false,
	additionalInformation: mockDefectAdditionalInformation(i),
	metadata: {
		category: {},
	},
});

export const mockDefectAdditionalInformation = (i = 0): DefectDetailsSchema['additionalInformation'] => ({
	location: mockDefectLocation(i),
	notes: 'Defect notes',
});

export const mockDefectLocation = (i = 0): DefectLocationSchema => ({
	seatNumber: i + 1,
	rowNumber: i + 1,
});
