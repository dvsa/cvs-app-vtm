import { BasePage } from './base.page';

export class OptInForBetasPage extends BasePage {
	readonly optInToBetaLink = this.page.locator('#betas-opt-in-button');
	readonly techRecordReDesignCreateDetailsOption = this.page.locator(
		'//label[contains(text(), "techrecordredesigncreatedetails")]/preceding-sibling::input'
	);
	readonly savePreferencesButton = this.page.locator('#save').first();
}
