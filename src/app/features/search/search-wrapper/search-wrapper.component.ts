import { FeatureToggleService } from '@/src/app/services/feature-toggle-service/feature-toggle-service';
import { Component, inject } from '@angular/core';
import { SearchComponent } from './search-v1/search.component';
import { SearchV2Component } from './search-v2/search-v2.component';

@Component({
	selector: 'app-search-wrapper',
	template: `
    @if (featureToggleService.isFeatureEnabled('TechRecordRedesign')) {
      <app-search-v2 />
    } @else {
      <app-search />
    }
  `,
	imports: [SearchComponent, SearchV2Component],
})
export class SearchWrapperComponent {
	featureToggleService = inject(FeatureToggleService);
}
