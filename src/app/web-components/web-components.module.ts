import { APP_INITIALIZER, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { appInitialize } from './app-initialize';

import { MatIconModule } from '@angular/material/icon'
import { CreateRecordIconComponent } from './create-record-icon/create-record-icon.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule
  ],
  declarations: [
    CreateRecordIconComponent
  ],
  exports: [
    CreateRecordIconComponent
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WebComponentsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: WebComponentsModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: appInitialize,
          multi: true
        }
      ]
    };
  }
}
