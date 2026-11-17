import { Button } from '../../components/button.component';
import { Input } from '../../components/input.component';
import { BasePage } from '../base.page';

export class EnterBatchSizePage extends BasePage {
	readonly heading = this.page.getByRole('heading', { name: /^Enter number of (HGVs|PSVs|trailers) in this batch$/ });
	readonly size = new Input(this.page, 'batchSize');
	readonly continueButton = new Button(this.page, 'continue-btn');
	readonly cancelButton = new Button(this.page, 'cancel-btn');
}
