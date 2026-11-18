import type { DefectDetailsSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';

export function registrationPlateDefect(prs = false): DefectDetailsSchema {
	return {
		imNumber: 1,
		imDescription: 'Registration Plate',
		itemNumber: 1,
		itemDescription: 'A registration plate:',
		deficiencyRef: '1.1.a',
		deficiencyId: 'a',
		deficiencySubId: null,
		deficiencyCategory: 'major',
		deficiencyText: 'missing.',
		stdForProhibition: false,
		prs,
		prohibitionIssued: false,
		additionalInformation: {
			location: {
				vertical: null,
				horizontal: null,
				lateral: null,
				longitudinal: 'front',
				rowNumber: null,
				seatNumber: null,
				axleNumber: null,
			},
			notes: 'Front registration plate missing',
		},
		metadata: { category: { additionalInfo: { location: { longitudinal: ['front', 'rear'] }, notes: false } } },
	};
}
