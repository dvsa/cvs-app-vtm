import { BasePage } from '../base.page';

export class TyreSearchTechRecordPage extends BasePage {
	readonly tyreSearchFilterDropDown = this.page.locator('id=filter');
	readonly tyreSearchTextBox = this.page.locator("[name='term']");
	readonly tyreSearchBtn = this.page.locator("[type='submit']");
	readonly axleTyreSearchBtn = this.page.locator("//button[contains(@id,'tyres_search-')]");
	readonly tyreSearchAddBtn = this.page.locator('id=add');
	readonly tyreSearchResultsTbl = this.page.locator('.govuk-table');
	readonly tyreSearchResultsCell = this.page.locator('.govuk-table__row', { hasText: 'Code' });
	readonly tyreSearchResultsHeadings = this.page.locator('.govuk-table__head');
	readonly tyreSearchHeading = this.page.locator('.govuk-heading-l');
	readonly tyreSearchResultsHeaderCode = this.page.locator('.govuk-table__header', { hasText: 'Code' });
	readonly axleTyreCancelBtn = this.page.locator('id=cancel');
}
