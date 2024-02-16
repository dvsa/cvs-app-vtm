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
      multi: true,
    },
  ],
})
export class CheckboxGroupComponent extends BaseControlComponent {
  @Input() options: FormNodeOption<OptionsType>[] = [];
  @Input() delimited?: { regex?: string; separator: string };

  isChecked(option: string | number | boolean): boolean {
    return this.value && this.value.includes(option);
  }

  handleChange(event: boolean, option: FormNodeOption<OptionsType>): void {
    return event ? this.add(option) : this.remove(option);
  }

  private add(option: FormNodeOption<OptionsType>) {
    if (!this.value) {
      this.value = this.delimited ? option.value : [option.value];
    } else {
      this.value = this.value.concat(this.delimited ? `${this.delimited.separator}${option.value}` : option.value);
    }

    this.onChange(this.value);
  }

  private remove(option: FormNodeOption<OptionsType>) {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const separator = this.delimited && this.delimited?.regex ? new RegExp(this.delimited?.regex) : this.delimited?.separator;

    let newValue = separator ? this.value?.split(separator) : [...this.value];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    newValue = newValue?.filter((v: any) => v !== option.value);

    newValue = separator ? newValue?.join(this.delimited?.separator) : newValue;

    this.value = newValue !== '' && newValue?.length !== 0 ? newValue : null;

    this.onChange(this.value);
  }
}
