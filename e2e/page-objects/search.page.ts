import { BasePage } from './base.page';

export class SearchTechRecordPage extends BasePage {
	readonly techRecordSearchLink = this.page.getByRole('link', { name: 'Search for a technical record' });
	readonly vehicleRegTrailerId = this.page.locator('#search-term');
	readonly filterResultsToggle = this.page.locator('#filterToggleButton');
	readonly searchCriteriaAll = this.page.locator('//label[@id="searchCriteria-all-label"]');
	readonly searchCriteriaVin = this.page.locator('//label[@id="searchCriteria-vin-label"]');
	readonly searchCriteriaPrimaryVrm = this.page.locator('//label[@id="searchCriteria-primaryVrm-label"]');
	readonly searchCriteriaTrailerId = this.page.locator('//label[@id="searchCriteria-trailerId-label"]');
	readonly searchCriteriaPartialVin = this.page.locator('//label[@id="searchCriteria-partialVin-label"]');
	readonly vehicleRegSubmitBtn = this.page.getByRole('button', { name: 'Search' });
	readonly createdVRMThroughAPI = this.page.locator('//*[@id="current-vrm-span"]');
	readonly vehicleIdentificationNo = this.page.locator('//td[@id="test-vin"]');
	readonly euVehicleCategoryValue = this.page.locator('//*[@id="test-techRecord_euVehicleCategory"]');
	readonly vehicleClassDescription = this.page.locator('//*[@id="test-vehicleClass"]');
	readonly vehicleClassDescriptionPSV = this.page.locator('//*[@id="test-techRecord_vehicleClass_psv"]');
	readonly vehicleConfiguration = this.page.locator('//*[@id="test-techRecord_vehicleConfiguration"]');
	readonly bodyModelValue = this.page.locator('//*[@id="test-techRecord_model"]');
	readonly selectTechnicalRecord = this.page.getByText('Select', { exact: true });
	readonly vin = this.page.locator('#test-vin').first();
	readonly errorSummaryTitle = this.page.locator('//*[@id="error-summary-title"]');
	readonly searchValidationError = this.page.locator('.govuk-error-summary__list');
	readonly bodyMakeValue = this.page.locator('//*[@id="test-techRecord_make"]');
	readonly titleForCreateTechRecordPage = this.page.locator('.title', { hasText: 'Create a new technical record' });
	readonly createNewTechRecordLink = this.page.locator('.govuk-link', { hasText: 'Create new tech record' });
	readonly globalSearchPageValidationError = this.page.locator('#search-term-global-error');
	readonly inLineSearchPageValidationError = this.page.locator('#search-term-error');
}
