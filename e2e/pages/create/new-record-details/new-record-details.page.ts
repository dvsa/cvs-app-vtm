import { AccordionsComponent } from '@/e2e/components/accordions.component';
import { BasePage } from '../../base.page';

export class NewRecordDetailsPage extends BasePage {
	readonly accordions = new AccordionsComponent(this.page);
}
