import {
  Component,
  Input,
  OnInit,
  forwardRef,
  OnDestroy,
  HostBinding,
  Injector,
  Type
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { FormFieldControl } from '@app/shared/components/control';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'vtm-autocomplete',
  templateUrl: './autocomplete.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    },
    {
      provide: FormFieldControl,
      useExisting: AutocompleteComponent
    }
  ]
})
export class AutocompleteComponent
  implements ControlValueAccessor, FormFieldControl, OnInit, OnDestroy {
  @Input() autocompleteData;
  @Input('aria-describedby') ariaDescribedBy: string | null;
  @Input('value') _value = '';
  @Input('govInputLength') govInputLength: string | null;

  @HostBinding('attr.id')
  externalId = '';

  autocompleteInput: FormControl;
  errorMessages?: { rule: string; message: string }[];
  controlType = 'text';
  multi = true;

  private internalId = '';
  private onDestroy$: Subject<void> = new Subject();
  private onchange: any = () => {};

  @Input()
  set id(value: string) {
    this.internalId = value;
    this.externalId = null;
  }
  get id() {
    return `${this.internalId}`;
  }

  set value(val) {
    this._value = val;
    this.onchange(val);
  }
  get value() {
    return this._value;
  }

  constructor(private injector: Injector) {}

  ngOnInit() {
    this.autocompleteInput = new FormControl();
    this.autocompleteInput.valueChanges
      .pipe(
        tap((result) => (this.value = result)),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  get ngControl(): NgControl {
    return this.injector.get<NgControl>(NgControl as Type<NgControl>);
  }

  writeValue(inputValue: string): void {
    this.autocompleteInput.patchValue(inputValue);
  }

  registerOnChange(fn: any): void {
    this.onchange = fn;
  }

  registerOnTouched(_: any): void {}
}
