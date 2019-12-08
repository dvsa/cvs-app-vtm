import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  {
    path: 'search',
    loadChildren: './technical-record-search/technical-record-search.module#TechnicalRecordSearchModule',
  },
  {
    path: 'technical-record',
    loadChildren: './technical-record/technical-record.module#TechnicalRecordModule',
  },
  { path: '**', redirectTo: '/search' },
];
