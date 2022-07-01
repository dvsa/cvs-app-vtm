import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { MultiOptions } from '@models/options.model';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
  selector: 'app-radio-group',
  templateUrl: './radio-group.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RadioGroupComponent,
      multi: true
    }
  ]
})
export class RadioGroupComponent extends BaseControlComponent {
  @Input() options: MultiOptions = [];
}
