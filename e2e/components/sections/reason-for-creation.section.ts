import { TextareaComponent } from '@/e2e/components/textarea.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../pages/base.page';

export class ReasonForCreationSection extends BasePage {
	readonly reasonForCreationTextarea = new TextareaComponent(this.page, 'techRecord_reasonForCreation');

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		await this.reasonForCreationTextarea.fill(data.techRecord_reasonForCreation);
	}
}
