import { Button } from '../../components/button.component';
import { TechnicalRecordPage } from './technical-record.page';

export class AmendTechnicalRecordPage extends TechnicalRecordPage {
	readonly heading = this.page.getByRole('heading', { name: 'Amend technical record', exact: true });
	readonly reviewButton = new Button(this.page, 'bottomsubmit');
}
