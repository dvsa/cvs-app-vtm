import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureToggleService } from '@services/feature-toggle-service/feature-toggle-service';
import { SearchResultsWrapperComponent } from '../search-results-wrapper.component';

@Component({ selector: 'app-search-results-v2', template: '' })
class SearchResultsV2StubComponent {}

@Component({ selector: 'app-multiple-search-results', template: '' })
class SearchResultsV1StubComponent {}

describe('SearchResultsWrapperComponent', () => {
	let fixture: ComponentFixture<SearchResultsWrapperComponent>;
	const featureToggleService = { isFeatureEnabled: jest.fn() };

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [SearchResultsWrapperComponent],
			providers: [{ provide: FeatureToggleService, useValue: featureToggleService }],
		})
			.overrideComponent(SearchResultsWrapperComponent, {
				set: { imports: [SearchResultsV1StubComponent, SearchResultsV2StubComponent] },
			})
			.compileComponents();
	});

	it('should render the v2 results flow when the redesign flag is enabled', () => {
		featureToggleService.isFeatureEnabled.mockReturnValue(true);
		fixture = TestBed.createComponent(SearchResultsWrapperComponent);

		fixture.detectChanges();

		expect(fixture.nativeElement.querySelector('app-search-results-v2')).toBeTruthy();
		expect(fixture.nativeElement.querySelector('app-multiple-search-results')).toBeFalsy();
		expect(featureToggleService.isFeatureEnabled).toHaveBeenCalledWith('techrecordredesigncreatedetails');
	});
});
