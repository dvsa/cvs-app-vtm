import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MultipleSearchResultsComponent } from './multiple-search-results/multiple-search-results.component';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { SingleSearchResultComponent } from './single-search-result/single-search-result.component';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		SearchRoutingModule,
		SearchComponent,
		SingleSearchResultComponent,
		MultipleSearchResultsComponent,
	],
})
export class SearchModule {}
