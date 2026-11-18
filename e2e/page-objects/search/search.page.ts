import type { SearchCriteria } from '../../api/technical-records.api';
import { Button } from '../../components/button.component';
import { Checkbox } from '../../components/checkbox.component';
import { Input } from '../../components/input.component';
import { Radios } from '../../components/radios.component';
import { BasePage } from '../base.page';
import { SearchResultCard } from './search-result.card';

export class SearchTechRecordPage extends BasePage {
	readonly heading = this.page.getByRole('heading', { name: 'Search for a technical record', exact: true });
	readonly techRecordSearchLink = this.page.getByRole('link', { name: 'Search for a technical record' });
	readonly form = this.page.locator('app-search-form');
	readonly term = new Input(this.form, 'search-term');
	readonly criteria = new Radios(this.form, 'searchCriteria');
	readonly includeArchived = new Checkbox(this.form, 'includeArchived-checkbox');
	readonly filtersButton = new Button(this.form, 'filterToggleButton');
	readonly searchButton = new Button(this.form, 'search-button');
	readonly applyButton = new Button(this.form, 'apply-button');
	readonly resultCount = this.form.locator('#changedName-hint');
	readonly results = this.page.locator('app-search-result');
	readonly resultVins = this.results.locator('#test-vin');
	readonly noRecordsHeading = this.page.getByRole('heading', { name: 'No Records Found', exact: true });
	readonly archivedRecordsLink = new Button(this.page, 'archived-records-link');
	readonly createNewTechRecordLink = new Button(this.page, 'create-technical-record-link');
	readonly pagination = this.page.getByRole('navigation', { name: 'results', exact: true });
	readonly nextPage = new Button(this.pagination, 'search-results-next-page');
	readonly previousPage = new Button(this.pagination, 'search-results-prev-page');
	readonly errors = this.page.locator('.govuk-error-summary__list');
	readonly globalSearchError = this.page.locator('#search-term-global-error');
	readonly inlineSearchError = this.form.locator('#search-term-error');

	result(index: number): SearchResultCard {
		return new SearchResultCard(this.results.nth(index));
	}

	async openFilters(): Promise<void> {
		if ((await this.filtersButton.locator.getAttribute('aria-expanded')) !== 'true') {
			await this.filtersButton.click();
		}
	}

	async fill(term: string, criteria: SearchCriteria, includeArchived = false): Promise<void> {
		await this.term.fill(term);
		await this.openFilters();
		await this.criteria.fill(criteria);
		await this.includeArchived.fill(includeArchived);
	}
}
