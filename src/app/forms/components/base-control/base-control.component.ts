import { AfterContentInit, Component, DoCheck, Injector, Input } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { CustomControl } from '../../services/dynamic-form.service';
import { ErrorMessageMap } from '../../utils/error-message-map';

@Component({
  selector: 'app-base-control',
  template: ``,
  styles: []
})
export class BaseControlComponent implements ControlValueAccessor, AfterContentInit, DoCheck {
  @Input() label?: string;
  @Input() name?: string;
  @Input() viewType?: string;
  @Input() hint?: string;

  public onChange = (event: any) => {};
  public onTouched = () => {};
  public focused = false;
  public errorMessage?: string;
  public control?: CustomControl;

  private value_: any;

  constructor(private injector: Injector) {}

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
    }
  }

  get value() {
    return this.value_;
  }

  set value(value) {
    this.value_ = value;
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
    this.value_ = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
