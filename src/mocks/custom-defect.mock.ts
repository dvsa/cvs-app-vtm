import { SpecialistCustomDefectsSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';

export const createMockCustomDefect = (
	params: Partial<SpecialistCustomDefectsSchema> = {}
): SpecialistCustomDefectsSchema => ({
	referenceNumber: 'referenceNumber',
	defectName: 'defectName',
	defectNotes: 'defectNotes',
	...params,
});

export const createMockAdditionalDefect = (
	params: Partial<SpecialistCustomDefectsSchema> = {}
): SpecialistCustomDefectsSchema => {
	const defect = {
		defectName: 'defectName',
		defectNotes: 'defectNotes',
		...params,
	} as SpecialistCustomDefectsSchema;

	return defect;
};
