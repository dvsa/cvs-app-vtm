import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { STORE_FEATURE_ROUTER_STORE_KEY } from './selectors/router.selectors';

@NgModule({
  declarations: [],
  imports: [CommonModule, StoreModule.forFeature(STORE_FEATURE_ROUTER_STORE_KEY, routerReducer), StoreRouterConnectingModule.forRoot()]
})
export class RouterStateModule {}
