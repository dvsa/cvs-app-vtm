import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
  selector: 'app-number-input-with-suffix',
  templateUrl: './number-input-with-suffix.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NumberInputWithSuffixComponent,
      multi: true
    }
  ]
})
export class NumberInputWithSuffixComponent extends BaseControlComponent {
  @Input() isEditing = false;
  @Input() suffix!: string;
}
