import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import { RouterStateModule } from './router/router-state.module';
import { TechnicalRecordsStateModule } from './technical-records/technical-records-state.module';
import { TestResultsStateModule } from './test-results/test-results.module';
import { UserStateModule } from './user/user-state.module';
import { TestRecordStateModule } from './test-records/test-record.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      name: 'VTM Web Dev Tools',
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production //Log-only mode in production
    }),
    UserStateModule,
    TechnicalRecordsStateModule,
    TestResultsStateModule,
    RouterStateModule,
    TestRecordStateModule
  ]
})
export class AppStoreModule {}
