import { Button } from '../../components/button.component';
import { TechnicalRecordPage } from './technical-record.page';

export class CreateTechnicalRecordDetailsPage extends TechnicalRecordPage {
	readonly createRecordButton = new Button(this.page, 'submit-record-continue');
}
