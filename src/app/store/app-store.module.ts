import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { GlobalErrorStateModule } from '@store/global-error/global-error-state.module';
import { environment } from '../../environments/environment';
import { RouterStateModule } from './router/router-state.module';
import { TechnicalRecordsStateModule } from './technical-records/technical-records-state.module';
import { TestRecordsStateModule } from './test-records/test-records.module';
import { UserStateModule } from './user/user-state.module';
import { SpinnerStateModule } from '@store/spinner/spinner-state.module';
import { ReferenceDataStateModule } from './reference-data/reference-data.module';
import { TestTypesStateModule } from './test-types/test-types.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      name: 'VTM Web Dev Tools',
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production // Log-only mode in production
    }),
    UserStateModule,
    TechnicalRecordsStateModule,
    TestRecordsStateModule,
    GlobalErrorStateModule,
    RouterStateModule,
    SpinnerStateModule,
    ReferenceDataStateModule,
    TestTypesStateModule
  ]
})
export class AppStoreModule {}
