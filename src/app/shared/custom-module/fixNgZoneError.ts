import { NgModule } from '@angular/core';
import { Router } from '@angular/router';

/**
 * NgModule as workaround for "Navigation triggered outside Angular zone" in tests
 *
 * https://github.com/angular/angular/issues/47236
 */
@NgModule()
export class FixNavigationTriggeredOutsideAngularZoneNgModule {
  constructor(_router: Router) {}
}
