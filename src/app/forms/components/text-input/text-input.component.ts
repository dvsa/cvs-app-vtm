import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlComponent } from '../base-control/base-control.component';
import { Width } from '@forms/services/dynamic-form.types';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextInputComponent,
      multi: true
    }
  ]
})
export class TextInputComponent extends BaseControlComponent {
  @Input() numeric: boolean = false;
  @Input() width?: number;
}
