import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/landing-page', pathMatch: 'full' },
  {
    path: 'landing-page',
    loadChildren: './landing-page/landing-page.module#LandingPageModule',
  },
  {
    path: 'search',
    loadChildren: './technical-record-search/technical-record-search.module#TechnicalRecordSearchModule',
  },
  {
    path: 'technical-record',
    loadChildren: './technical-record/technical-record.module#TechnicalRecordModule',
  },
  { path: '**', redirectTo: '/landing-page' },
];
