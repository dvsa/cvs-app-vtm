import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { STORE_FEATURE_SPINNER_KEY, spinnerReducer } from '@store/spinner/spinner.reducer';

@NgModule({
	imports: [CommonModule, StoreModule.forFeature(STORE_FEATURE_SPINNER_KEY, spinnerReducer)],
})
export class SpinnerStateModule {}
