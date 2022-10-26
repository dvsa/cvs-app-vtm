import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormNodeOption } from '@forms/services/dynamic-form.types';
import { BaseControlComponent } from '../base-control/base-control.component';

type OptionsType = string | number | boolean;
@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckboxGroupComponent,
      multi: true
    }
  ]
})
export class CheckboxGroupComponent extends BaseControlComponent {
  @Input() options: FormNodeOption<OptionsType>[] = [];
  @Input() delimited?: { regex?: string; separator: string };

  isChecked(option: string | number | boolean): boolean {
    const checked = this.value && this.value.includes(option);
    return checked;
  }

  handleChange(event: boolean, option: FormNodeOption<OptionsType>): void {
    event ? this.add(option) : this.remove(option);
  }

  private add(option: FormNodeOption<OptionsType>) {
    if (!this.value) {
      this.value = this.delimited ? option.value : [option.value];
    } else {
      this.value = this.value.concat(this.delimited ? this.delimited.separator + option.value : option.value);
    }
    this.onChange(this.value);
  }

  private remove(option: FormNodeOption<OptionsType>) {
    const separator = this.delimited && this.delimited?.regex ? new RegExp(this.delimited?.regex) : this.delimited?.separator;
    let newValue = separator ? this.value.split(separator) : [...this.value];
    if (newValue && newValue.length > 0) {
      const i = newValue.indexOf(option.value);
      if (i > -1) {
        newValue.splice(i, 1);
      }
      newValue = separator ? newValue.join(this.delimited?.separator) : newValue;
    }
    if ((newValue === '' || newValue) && newValue.length === 0) {
      newValue = null;
    }
    this.value = newValue;

    this.onChange(this.value);
  }

  trackByFn(i: number) {
    return i;
  }
}
