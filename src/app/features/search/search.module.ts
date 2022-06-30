import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { SharedModule } from '@shared/shared.module';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { SingleSearchResultComponent } from './single-search-result/single-search-result.component';
import { MultipleSearchResultsComponent } from './multiple-search-results/multiple-search-results.component';

@NgModule({
  declarations: [SearchComponent, SingleSearchResultComponent, MultipleSearchResultsComponent],
  imports: [CommonModule, DynamicFormsModule, RouterModule, SearchRoutingModule, SharedModule]
})
export class SearchModule {}
