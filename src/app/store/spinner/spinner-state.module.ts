import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { STORE_FEATURE_SPINNER_KEY, spinnerReducer } from '@store/spinner/reducers/spinner.reducer';

@NgModule({
	declarations: [],
	imports: [CommonModule, StoreModule.forFeature(STORE_FEATURE_SPINNER_KEY, spinnerReducer)],
})
export class SpinnerStateModule {}
