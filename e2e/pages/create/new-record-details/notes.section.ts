import { TextareaComponent } from '@/e2e/components/textarea.component';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BasePage } from '../../base.page';

export class NotesSection extends BasePage {
	readonly notesTextarea = new TextareaComponent(this.page, 'techRecord_notes');
	readonly remarksTextarea = new TextareaComponent(this.page, 'techRecord_remarks');
	readonly dispensationsTextarea = new TextareaComponent(this.page, 'techRecord_dispensations');

	async fill(data: Partial<TechRecordType<'put'>>): Promise<void> {
		switch (data.techRecord_vehicleType) {
			case 'psv':
				await this.remarksTextarea.fill(data.techRecord_remarks);
				await this.dispensationsTextarea.fill(data.techRecord_dispensations);
				break;
			// Note: cannot use default as this causes type errors
			case 'hgv':
			case 'trl':
			case 'car':
			case 'lgv':
			case 'motorcycle':
				await this.notesTextarea.fill(data.techRecord_notes);
				break;
		}
	}
}
