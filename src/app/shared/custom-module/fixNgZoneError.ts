import { NgModule } from '@angular/core';
import { Router } from '@angular/router';

/**
 * NgModule as workaround for "Navigation triggered outside Angular zone" in tests
 *
 * https://github.com/angular/angular/issues/47236
 */
@NgModule()
export class FixNavigationTriggeredOutsideAngularZoneNgModule {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor, @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  constructor(_router: Router) { }
}
