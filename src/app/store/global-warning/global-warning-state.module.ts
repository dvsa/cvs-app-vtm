import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import {
	STORE_FEATURE_GLOBAL_WARNING_KEY,
	globalWarningReducer,
} from '@store/global-warning/global-warning-service.reducers';

@NgModule({
	imports: [CommonModule, StoreModule.forFeature(STORE_FEATURE_GLOBAL_WARNING_KEY, globalWarningReducer)],
})
export class GlobalWarningStateModule {}
