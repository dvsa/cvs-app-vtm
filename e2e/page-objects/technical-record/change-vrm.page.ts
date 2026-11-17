import { Button } from '../../components/button.component';
import { Input } from '../../components/input.component';
import { BasePage } from '../base.page';

export class ChangeVrmPage extends BasePage {
	readonly heading = this.page.getByRole('heading', { name: 'Change VRM', exact: true });
	readonly newVrm = new Input(this.page, 'new-vrm');
	readonly currentVrm = new Input(this.page, 'current-vrm');
	readonly previousVrm = new Input(this.page, 'previous-vrm');
	readonly thirdMark = new Input(this.page, 'third-mark');
	readonly saveButton = new Button(this.page, 'submit-vrm');
}
