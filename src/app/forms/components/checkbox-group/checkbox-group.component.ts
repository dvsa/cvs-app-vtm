import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormNodeOption } from '@forms/services/dynamic-form.types';
import { BaseControlComponent } from '../base-control/base-control.component';

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
  @Input() options: FormNodeOption<string | number | boolean>[] = [];
  @Input() separator?: string;

  isChecked(option: string | number | boolean): boolean {
    const checked = this.value && this.value.includes(option);
    return checked;
  }

  handleChange(event: boolean, option: FormNodeOption<string | number | boolean>): void {
    event ? this.add(option) : this.remove(option);
  }

  private add(option: FormNodeOption<string | number | boolean>) {
    if (this.separator) {
      !this.value ? (this.value = option.value) : (this.value += this.separator + option.value);
    } else {
      !this.value ? (this.value = [option.value]) : this.value.push(option.value);
    }
    this.onChange(this.value);
  }

  private remove(option: FormNodeOption<string | number | boolean>) {
    let newValue = this.separator ? this.value.split(this.separator) : [...this.value];
    if (newValue && newValue.length > 0) {
      const i = newValue.indexOf(option.value);
      if (i > -1) {
        newValue.splice(i, 1);
      }
      newValue = this.separator ? newValue.join(this.separator) : newValue;
    }
    if ((newValue === '' || newValue) && newValue.length === 0) {
      newValue = null;
    }
    this.value = newValue;

    this.onChange(this.value);
  }
}
