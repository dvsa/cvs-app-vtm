import { ChangeDetectorRef, Component, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextAreaComponent,
      multi: true
    }
  ]
})
export class TextAreaComponent extends BaseControlComponent {}
