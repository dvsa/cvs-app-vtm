import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { globalErrorReducer, STORE_FEATURE_GLOBAL_ERROR_KEY } from '@store/global-error/reducers/global-error-service.reducer';

@NgModule({
  declarations: [],
  imports: [CommonModule, StoreModule.forFeature(STORE_FEATURE_GLOBAL_ERROR_KEY, globalErrorReducer)],
})
export class GlobalErrorStateModule {}
