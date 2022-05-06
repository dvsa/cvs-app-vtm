import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { spinnerReducer, STORE_SPINNER_KEY } from '@store/spinner/reducers/spinner.reducer';

@NgModule({
  declarations: [],
  imports: [CommonModule, StoreModule.forFeature(STORE_SPINNER_KEY, spinnerReducer)]
})
export class SpinnerStateModule {}
