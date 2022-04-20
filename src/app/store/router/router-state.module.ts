import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [],
  imports: [CommonModule, StoreModule.forFeature('router', routerReducer), StoreRouterConnectingModule.forRoot()]
})
export class RouterStateModule {}
