import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormNodeOption } from '@forms/services/dynamic-form.types';
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
  @Input() options: FormNodeOption<string | number | boolean>[] = [];
  @Input() inline: boolean = false;
  @Input() isEditing = true;

  getLabel(value: any): string | undefined {
    return this.options.find(option => option.value === value)?.label;
  }

  trackByFn = (index: number): number => index;
}
