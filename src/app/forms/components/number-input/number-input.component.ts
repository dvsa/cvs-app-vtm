import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NumberInputComponent,
      multi: true
    }
  ]
})
export class NumberInputComponent extends BaseControlComponent {
  @Input() isEditing = true;
}
