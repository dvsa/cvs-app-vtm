import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoQueryParamsGuard } from '@guards/no-query-params/no-query-params.guard';
import { MultipleSearchResultsComponent } from './multiple-search-results/multiple-search-results.component';
import { SearchComponent } from './search.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: SearchComponent
  },
  {
    path: 'results',
    component: MultipleSearchResultsComponent,
    canActivate: [NoQueryParamsGuard],
    data: { title: 'Search Results' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule {}
