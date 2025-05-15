import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { STORE_FEATURE_ROUTER_STORE_KEY } from './router.selectors';

@NgModule({
	imports: [
		CommonModule,
		StoreModule.forFeature(STORE_FEATURE_ROUTER_STORE_KEY, routerReducer),
		StoreRouterConnectingModule.forRoot(),
	],
})
export class RouterStateModule {}
