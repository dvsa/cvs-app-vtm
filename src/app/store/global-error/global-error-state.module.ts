import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import {
	STORE_FEATURE_GLOBAL_ERROR_KEY,
	globalErrorReducer,
} from '@store/global-error/reducers/global-error-service.reducer';

@NgModule({
	declarations: [],
	imports: [CommonModule, StoreModule.forFeature(STORE_FEATURE_GLOBAL_ERROR_KEY, globalErrorReducer)],
})
export class GlobalErrorStateModule {}
