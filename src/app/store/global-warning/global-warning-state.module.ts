import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import {
	STORE_FEATURE_GLOBAL_WARNING_KEY,
	globalWarningReducer,
} from '@store/global-warning/reducers/global-warning-service.reducers';

@NgModule({
	declarations: [],
	imports: [CommonModule, StoreModule.forFeature(STORE_FEATURE_GLOBAL_WARNING_KEY, globalWarningReducer)],
})
export class GlobalWarningStateModule {}
