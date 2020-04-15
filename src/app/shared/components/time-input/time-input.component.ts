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

let index = 0;

@Component({
  selector: 'vtm-time-input',
  templateUrl: './time-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeInputComponent),
      multi: true
    },
    {
      provide: FormFieldControl,
      useExisting: TimeInputComponent
    }
  ]
})
export class TimeInputComponent
  implements ControlValueAccessor, FormFieldControl, OnInit, OnDestroy {
  timeInputs: FormGroup;
  controlType = 'time';
  multi = true;

  @HostBinding('attr.id')
  externalId = '';

  @Input('aria-describedby') ariaDescribedBy: string | null;
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
    this.timeInputs = new FormGroup({
      hour: new FormControl(''),
      minute: new FormControl('')
    });
    this.timeInputs.valueChanges
      .pipe(
        map(({hour, minute}) => {
          const resultDate = new Date();

          resultDate.setUTCHours(hour);
          resultDate.setUTCMinutes(minute);

          if (!!resultDate.toJSON()) {
            return resultDate.toISOString();
          }

          return null;
        }),
        tap((result) => {
          this.value = result;
        }),
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

  writeValue(timeString: string): void {

    let hour = '';
    let minute = '';
    const getDate = new Date(timeString);

    [hour, minute] = !!getDate.toJSON()
      ? [getDate.getUTCHours().toString(), getDate.getUTCMinutes().toString()]
      : [hour, minute];

    this.timeInputs.patchValue({ hour, minute });
  }

  registerOnChange(fn: any): void {
    this.onchange = fn;
  }

  registerOnTouched(_: any): void {}
}
