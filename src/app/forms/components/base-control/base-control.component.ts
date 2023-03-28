import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, Injector, Input } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { PrefixDirective } from '@forms/directives/prefix.directive';
import { SuffixDirective } from '@forms/directives/suffix.directive';
import { ValidatorNames } from '@forms/models/validators.enum';
import { CustomControl, FormNodeViewTypes, FormNodeWidth } from '../../services/dynamic-form.types';
import { ErrorMessageMap } from '../../utils/error-message-map';

@Component({
  selector: 'app-base-control',
  template: ``,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  @Input() warning?: string;

  public onChange = (event: any) => {};
  public onTouched = () => {};
  public focused = false;
  public errorMessage?: string;
  public control?: CustomControl;

  private value_: any;

  constructor(private injector: Injector, protected cdr: ChangeDetectorRef) {
    this.name = '';
  }

  ngAfterContentInit(): void {
    const ngControl: NgControl | null = this.injector.get(NgControl, null);
    if (ngControl) {
      this.control = ngControl.control as CustomControl;
      this.control.meta && (this.control.meta.changeDetection = this.cdr);
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
    return this.value_;
  }

  set value(value) {
    this.value_ = value;
  }

  get disabled() {
    return this.control?.disabled ?? false;
  }

  get meta() {
    return this.control?.meta;
  }

  get thisWarning() {
    if (this.warning) {
      return this.warning;
    } else {
      return null;
    }
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

  trackBy(i: number) {
    return i;
  }
}
