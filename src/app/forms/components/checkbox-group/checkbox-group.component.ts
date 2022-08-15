import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormNodeOption } from '@forms/services/dynamic-form.types';
import { MultiOption } from '../../models/options.model';
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

  isChecked(option: string | number | boolean): boolean {
    const checked = this.value && this.value.includes(option);
    return checked;
  }

  handleChange(event: boolean, option: FormNodeOption<string | number | boolean>): void {
    event ? this.add(option) : this.remove(option);
  }

  private add(option: FormNodeOption<string | number | boolean>) {
    !this.value ? (this.value = [option.value]) : this.value.push(option.value);
    this.onChange(this.value);
  }

  private remove(option: FormNodeOption<string | number | boolean>) {
    if (this.value && this.value.length > 0) {
      const i = this.value && this.value.indexOf(option.value);
      if (i > -1) {
        this.value.splice(i, 1);
      }
    }

    if (this.value && this.value.length === 0) {
      this.value = null;
    }

    this.onChange(this.value);
  }
}
