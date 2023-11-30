import {
  AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, Injector, Input,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { PrefixDirective } from '@forms/directives/prefix.directive';
import { SuffixDirective } from '@forms/directives/suffix.directive';
import { ValidatorNames } from '@forms/models/validators.enum';
// eslint-disable-next-line import/no-cycle
import { CustomControl, FormNodeViewTypes, FormNodeWidth } from '../../services/dynamic-form.types';
import { ErrorMessageMap } from '../../utils/error-message-map';

@Component({
  selector: 'app-base-control',
  template: '',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseControlComponent implements ControlValueAccessor, AfterContentInit {
  @ContentChild(PrefixDirective) prefix?: PrefixDirective;
  @ContentChild(SuffixDirective) suffix?: SuffixDirective;

  @Input() name = '';
  @Input() customId?: string;
  @Input() hint?: string;
  @Input() label?: string;
  @Input() width?: FormNodeWidth;
  @Input() viewType: FormNodeViewTypes = FormNodeViewTypes.STRING;
  @Input() noBottomMargin = false;
  @Input() warning?: string | null = null;

  public onChange: (event: unknown) => void = () => {};
  public onTouched = () => {};
  public focused = false;
  public errorMessage?: string;
  public control?: CustomControl;

  private control_value: any;

  constructor(protected injector: Injector, protected cdr: ChangeDetectorRef) {
    this.name = '';
  }

  ngAfterContentInit(): void {
    const ngControl: NgControl | null = this.injector.get(NgControl, null);
    if (ngControl) {
      this.control = ngControl.control as CustomControl;
      if (this.control && this.control.meta) {
        this.control.meta.changeDetection = this.cdr;
      }
    } else {
      throw new Error(`No control binding for ${this.name}`);
    }
  }

  get error(): string {
    if (this.control?.touched && this.control.invalid) {
      const { errors } = this.control;
      if (errors) {
        const errorList = Object.keys(errors);
        const firstError = ErrorMessageMap[errorList[0] as ValidatorNames];
        return firstError(errors[errorList[0]], this.label);
      }
    }
    return '';
  }

  get value() {
    return this.control_value;
  }

  set value(value) {
    this.control_value = value;
  }

  get disabled() {
    return this.control?.disabled ?? false;
  }

  get meta() {
    return this.control?.meta;
  }

  public handleEvent(event: Event) {
    switch (event.type) {
      case 'focus':
        this.focused = true;
        return true;
      case 'blur':
        this.focused = false;
        return false;
      default:
        return null;
    }
  }

  writeValue(obj: unknown): void {
    this.value = obj;
  }

  registerOnChange(fn: (event: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  trackBy(i: number) {
    return i;
  }
}
