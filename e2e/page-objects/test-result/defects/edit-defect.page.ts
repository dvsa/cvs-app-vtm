import { Button } from '../../../components/button.component';
import { Textarea } from '../../../components/textarea.component';
import { BasePage } from '../../base.page';

export class EditDefectPage extends BasePage {
	readonly heading = this.page.getByRole('heading', { name: 'Defect details', exact: true, level: 1 });
	readonly frontLocation = this.page.getByRole('radio', { name: 'Front', exact: true });
	readonly notes = new Textarea(this.page, 'notes');
	readonly repairedDuringTest = this.page.getByRole('checkbox', { name: 'Defect repaired during test', exact: true });
	readonly confirmButton = new Button(this.page, 'confirm-defect');
	readonly removeButton = new Button(this.page, 'remove-defect');
}
