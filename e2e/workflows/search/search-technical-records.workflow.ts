import { type Response, expect } from '@playwright/test';
import type { SearchCriteria } from '../../api/technical-records.api';
import type { PageFactory } from '../../page-objects/page.factory';

export interface TechnicalRecordSearch {
	term: string;
	criteria: SearchCriteria;
	includeArchived?: boolean;
}

export async function submitTechnicalRecordSearch(
	pages: PageFactory,
	search: TechnicalRecordSearch,
	applyFilters = false
): Promise<void> {
	const searchPage = pages.searchTechRecordPage;
	const [response] = await Promise.all([
		pages.page.waitForResponse((response: Response) => {
			const url = new URL(response.url());
			return (
				response.request().method() === 'GET' &&
				url.pathname.endsWith(`/tech-records/v4/search/${encodeURIComponent(search.term.toUpperCase())}`) &&
				url.searchParams.get('searchCriteria') === search.criteria
			);
		}),
		(applyFilters ? searchPage.applyButton : searchPage.searchButton).click(),
	]);
	expect([200, 404], 'Search must succeed or return the documented no-matches response').toContain(response.status());
	await expect(pages.page).toHaveURL((url) => {
		return (
			url.pathname === '/search/results' &&
			url.searchParams.get('searchTerm') === search.term.toUpperCase() &&
			url.searchParams.get('searchCriteria') === search.criteria &&
			url.searchParams.get('includeArchived') === String(search.includeArchived ?? false)
		);
	});
}

export async function searchTechnicalRecords(pages: PageFactory, search: TechnicalRecordSearch): Promise<void> {
	await pages.page.goto('/search');
	await expect(pages.searchTechRecordPage.heading).toBeVisible();
	await pages.searchTechRecordPage.fill(search.term, search.criteria, search.includeArchived);
	await submitTechnicalRecordSearch(pages, search);
}
