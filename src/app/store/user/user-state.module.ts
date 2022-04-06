import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { STORE_FEATURE_USER_KEY, userServiceReducer } from './user-service.reducer';

@NgModule({
  declarations: [],
  imports: [CommonModule, StoreModule.forFeature(STORE_FEATURE_USER_KEY, userServiceReducer)]
})
export class UserStateModule {}
