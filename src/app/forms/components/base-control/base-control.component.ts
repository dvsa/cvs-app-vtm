import { AfterContentInit, Component, DoCheck, Injector, Input } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { CustomControl, FormNodeViewTypes } from '../../services/dynamic-form.types';
import { ErrorMessageMap } from '../../utils/error-message-map';

@Component({
  selector: 'app-base-control',
  template: ``,
  styles: []
})
export class BaseControlComponent implements ControlValueAccessor, AfterContentInit, DoCheck {
  @Input() name = '';
  @Input() label?: string;
  @Input() viewType: FormNodeViewTypes = FormNodeViewTypes.STRING;
  @Input() hint?: string;

  public onChange = (event: any) => {};
  public onTouched = () => {};
  public focused = false;
  public errorMessage?: string;
  public control?: CustomControl;

  private value_: any;

  constructor(private injector: Injector) {
    this.name = '';
  }

  ngAfterContentInit(): void {
    const ngControl: NgControl | null = this.injector.get(NgControl, null);
    if (ngControl) {
      this.control = ngControl.control as CustomControl;
    } else {
      throw new Error(`No control binding for ${this.name}`);
    }
  }

  ngDoCheck(): void {
    this.getError();
  }

  private getError() {
    if (this.control && this.control.touched && this.control.invalid) {
      const { errors } = this.control;
      if (errors) {
        const errorList = Object.keys(errors);
        const firstError = ErrorMessageMap[errorList[0]];
        this.errorMessage = firstError(errors[errorList[0]], this.label);
      }
    } else {
      this.errorMessage = '';
    }
  }

  get value() {
    return this.value_;
  }

  set value(value) {
    this.value_ = value;
  }

  get disabled() {
    return this.control?.disabled;
  }

  get meta() {
    return this.control?.meta;
  }

  public handleEvent(event: Event) {
    switch (event.type) {
      case 'focus':
        this.focused = true;
        break;
      case 'blur':
        this.focused = false;
        break;
      default:
        console.log('unhandled:', event);
    }
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
