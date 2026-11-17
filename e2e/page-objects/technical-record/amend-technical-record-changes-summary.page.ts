import { Button } from '../../components/button.component';
import { BasePage } from '../base.page';

export class AmendTechnicalRecordChangesSummaryPage extends BasePage {
	readonly heading = this.page.getByRole('heading', { name: 'Review technical record', exact: true });
	readonly submitButton = new Button(this.page, 'submit');
}
