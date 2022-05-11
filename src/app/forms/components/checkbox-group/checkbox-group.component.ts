import { Component, Injector, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlComponent } from '../base-control/base-control.component';

interface Option {
  label: string;
  value: string;
}

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckboxGroupComponent,
      multi: true
    }
  ]
})
export class CheckboxGroupComponent extends BaseControlComponent {
  @Input() options: Option[] = [];

  constructor(injector: Injector) {
    super(injector);
  }

  isChecked(option: string) {
    const checked = this.value && (this.value as Array<string>).includes(option);
    return checked;
  }

  handleChange(event: boolean, option: Option) {
    console.log(event);
    event ? this.add(option) : this.remove(option);
  }

  add(option: Option) {
    !this.value ? (this.value = [option.value]) : this.value.push(option.value);
    this.onChange(this.value);
  }

  remove(option: Option) {
    if (this.value && this.value.length > 0) {
      const i = (this.value as string[]).indexOf(option.value);
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
