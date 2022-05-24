import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { SearchComponent } from './search.component';

const routes: Routes = [
  {
    path: ':vin',
    component: SearchComponent,
    canActivateChild: [MsalGuard],
   },
   {
    path: '',
    component: SearchComponent,
    canActivateChild: [MsalGuard],
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule {}
