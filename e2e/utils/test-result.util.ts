import { DefectDetailsSchema } from '@dvsa/cvs-type-definitions/types/v1/test-result';

export function getDefectIndex(data: DefectDetailsSchema): string {
	return data.deficiencyCategory === 'advisory' ? 'advisory' : data.deficiencyRef;
}
