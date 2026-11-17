import { Button } from '../../components/button.component';
import { Textarea } from '../../components/textarea.component';
import { BasePage } from '../base.page';

export class ChangeVtaVisibilityPage extends BasePage {
	readonly heading = this.page.getByRole('heading', { name: 'Change technical record visibility in VTA', exact: true });
	readonly actionHeading = this.page.getByRole('heading', { name: /^(Hide|Show) record in VTA$/ });
	readonly reason = new Textarea(this.page, 'reason');
	readonly submitButton = new Button(this.page, 'submit');
}
