import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormNodeOption } from '@forms/services/dynamic-form.types';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
  selector: 'app-select[options]',
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectComponent,
      multi: true
    }
  ]
})
export class SelectComponent extends BaseControlComponent {
  @Input() options!: Array<FormNodeOption<string | number | boolean>>;
  @Input() isEditing = true;
}
