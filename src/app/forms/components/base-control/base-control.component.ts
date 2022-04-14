import { Component, Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-base-control',
  template: ``,
  styles: []
})
export class BaseControlComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() name?: string;
  @Input() hint?: string;
  errorMessage?: string;

  onChange = (event: any) => {};
  onTouched = () => {};

  private value_: any;

  constructor() {}

  get value() {
    return this.value_;
  }

  set value(value) {
    this.value_ = value;
  }

  writeValue(obj: any): void {
    this.value_ = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
