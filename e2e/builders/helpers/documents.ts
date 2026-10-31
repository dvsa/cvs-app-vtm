import { MicrofilmDocumentType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/put/hgv/complete';

export function createDocuments() {
	return {
		techRecord_microfilm_microfilmDocumentType: 'Tempo 100 Permit' as MicrofilmDocumentType,
		techRecord_microfilm_microfilmRollNumber: '12345',
		techRecord_microfilm_microfilmSerialNumber: '1234',
	};
}
