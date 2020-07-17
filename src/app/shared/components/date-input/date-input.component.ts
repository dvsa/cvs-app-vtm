import {
  Component,
  Input,
  forwardRef,
  HostBinding,
  Injector,
  Type,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
  FormGroup,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  NgControl
} from '@angular/forms';
import { map, tap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormFieldControl } from '../control';

/**
 * @usageNotes
 *
 * Date component - receives as input a formControl in the
 * this format
 *
 * ```approvalDate: new FormControl('2020-03-10'),
 *
 * <vtm-date-input
 *   id="approvalDate"
 *   ariaDescribedBy="approvalDate"
 *   formControlName="approvalDate"
 * ></vtm-date-input>
 *
 * ```
 */

let index = 0;

function pad(num: number): string {
  const value = String(num);
  return value.length >= 2 ? value : new Array(2 - value.length + 1).join('0') + value;
}

@Component({
  selector: 'vtm-date-input',
  templateUrl: './date-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true
    },
    {
      provide: FormFieldControl,
      useExisting: DateInputComponent
    }
  ]
})
export class DateInputComponent
  implements ControlValueAccessor, FormFieldControl, OnInit, OnDestroy {
  /**
   * TODO:
   * Add to implement validator
   * Enable validation display in the html
   * Check for entered date is correct i.e not 03-02-2999
   * Implement custom validators i.e. minDate, maxDate
   * Set some standard internal date error messages
   */

  dateInputs: FormGroup;
  errorMessages?: { rule: string; message: string }[];
  controlType = 'date';
  multi = true;

  @Input('aria-describedby') ariaDescribedBy: string | null;

  @HostBinding('attr.id')
  externalId = '';

  @Input()
  set id(value: string) {
    this.internalId = value;
    this.externalId = null;
  }
  get id() {
    return `${this.internalId}-${index}`;
  }
  private internalId = '';

  @Input('value') _value = '';
  set value(val) {
    this._value = val;
    this.onchange(val);
  }
  get value() {
    return this._value;
  }

  private onDestroy$: Subject<void> = new Subject();
  private onchange: any = () => {};

  constructor(private injector: Injector) {
    index += 1;
  }

  ngOnInit(): void {
    this.dateInputs = new FormGroup({
      day: new FormControl(''),
      month: new FormControl(''),
      year: new FormControl('')
    });

    // get a composite value of the 3 inputs
    this.dateInputs.valueChanges
      .pipe(
        map(({ day, month, year }) => {
          if (day || month || year) {
            return [year ? year : '', month ? pad(month) : '', day ? pad(day) : ''].join('-');
          }
          return null;
        }),
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
    // console.log('Value of ngControl', this.injector.get(NgControl));
    // return this.injector.get(NgControl);
    return this.injector.get<NgControl>(NgControl as Type<NgControl>);
  }

  writeValue(dateString: string): void {
    let day = '';
    let month = '';
    let year = '';

    [year, month, day] = (dateString || '').split('-');
    day = !!day ? (day.includes('T') ? day.split('T')[0] : day) : '';

    this.dateInputs.patchValue({ day, month, year });
  }

  registerOnChange(fn: any): void {
    this.onchange = fn;
  }

  registerOnTouched(_: any): void {}
}
