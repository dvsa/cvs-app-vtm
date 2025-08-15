import { FeatureToggleService } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { Component, inject } from '@angular/core';
import { MultipleSearchResultsComponent } from './search-results-v1/multiple-search-results.component';
import { SearchResultsV2Component } from './search-results-v2/search-results-v2.component';

@Component({
	selector: 'app-search-results-wrapper',
	template: `
    @if (featureToggleService.isFeatureEnabled('TechRecordRedesign')) {
      <app-search-results-v2 />
    } @else {
      <app-multiple-search-results />
    }
  `,
	imports: [MultipleSearchResultsComponent, SearchResultsV2Component],
})
export class SearchResultsWrapperComponent {
	featureToggleService = inject(FeatureToggleService);
}
