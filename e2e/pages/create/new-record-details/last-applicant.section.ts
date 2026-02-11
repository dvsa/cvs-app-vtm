import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../base.page';

export class LastApplicantSection extends BasePage {
	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		// @TODO: handle other vehicle types
	}
}
