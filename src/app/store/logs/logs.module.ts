import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { STORE_FEATURE_LOGS_KEY } from '@store/logs/logs.feature';
import { LogsEffects } from './logs.effects';
import { logsReducer } from './logs.reducer';

@NgModule({
	imports: [StoreModule.forFeature(STORE_FEATURE_LOGS_KEY, logsReducer), EffectsModule.forFeature([LogsEffects])],
})
export class LogsModule {}
