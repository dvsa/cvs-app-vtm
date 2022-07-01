import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
    component: MultipleSearchResultsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule {}
