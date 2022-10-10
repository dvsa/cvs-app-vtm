import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, Injector, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControlDirective, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import validateDate from 'validate-govuk-date';
import { DateValidators } from '../../validators/date/date.validators';
import { BaseControlComponent } from '../base-control/base-control.component';

type Segments = {
  day: Observable<number | undefined>;
  month: Observable<number | undefined>;
  year: Observable<number | undefined>;
  hour?: Observable<number | undefined | string>;
  minute?: Observable<number | undefined | string>;
};
@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DateComponent,
      multi: true
    }
  ]
})
export class DateComponent extends BaseControlComponent implements OnInit, OnDestroy, AfterContentInit {
  @Input() includeTime = false;
  @ViewChild('dayEl') dayEl?: ElementRef<HTMLInputElement>;
  @ViewChild('dayModel') dayModel?: AbstractControlDirective;

  private day_: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);
  private month_: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);
  private year_: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);
  private hour_: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);
  private minute_: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);
  private day$: Observable<number | undefined>;
  private month$: Observable<number | undefined>;
  private year$: Observable<number | undefined>;
  private hour$: Observable<number | undefined>;
  private minute$: Observable<number | undefined>;
  private subscriptions: Array<Subscription | undefined> = [];
  public originalDate: string = '';
  public errors?: { error: boolean; date?: Date; errors?: { error: boolean; reason: string; index: number }[] };

  public day?: number;
  public month?: number;
  public year?: number;
  public hour?: number;
  public minute?: number;

  constructor(injector: Injector, changeDetectorRef: ChangeDetectorRef) {
    super(injector, changeDetectorRef);
    this.day$ = this.day_.asObservable();
    this.month$ = this.month_.asObservable();
    this.year$ = this.year_.asObservable();
    this.hour$ = this.hour_.asObservable();
    this.minute$ = this.minute_.asObservable();
  }

  ngOnInit(): void {
    this.subscriptions.push(this.subscribeAndPropagateChanges());
  }

  override ngAfterContentInit(): void {
    super.ngAfterContentInit();
    this.originalDate = this.value;
    this.addValidators();
    this.valueWriteBack(this.value);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s && s.unsubscribe());
  }

  onDayChange(event: any) {
    this.day_.next(event);
  }

  onMonthChange(event: any) {
    this.month_.next(event);
  }

  onYearChange(event: any) {
    this.year_.next(event);
  }

  onHourChange(event: any) {
    this.hour_.next(event);
  }

  onMinuteChange(event: any) {
    this.minute_.next(event);
  }

  valueWriteBack(value: string | null): void {
    if (value && typeof value === 'string') {
      const date = new Date(value);
      this.day = date.getDate();
      this.day_.next(this.day);
      this.month = date.getMonth() + 1;
      this.month_.next(this.month);
      this.year = date.getFullYear();
      this.year_.next(this.year);
      this.hour = date.getHours();
      this.hour_.next(this.hour);
      this.minute = date.getMinutes();
      this.minute_.next(this.minute);
    }
  }

  /**
   * Subscribes to all date segments and propagates value as `Date`.
   * @returns Subscription
   */
  subscribeAndPropagateChanges() {
    const dateFields: Segments = this.includeTime
      ? { day: this.day$, month: this.month$, year: this.year$, hour: this.hour$, minute: this.minute$ }
      : { day: this.day$, month: this.month$, year: this.year$ };

    return combineLatest(dateFields).subscribe({
      next: ({ day, month, year, hour, minute }) => {
        if (!day && !month && !year && !hour && !minute) {
          this.onChange(null);
          return;
        }

        hour = this.includeTime ? hour : this.getFieldOrDefault().getHours();
        minute = this.includeTime ? minute : this.getFieldOrDefault().getMinutes();
        const second = this.getFieldOrDefault().getSeconds();

        this.onChange(
          `${year || ''}-${this.padded(month)}-${this.padded(day)}T${this.padded(hour)}:${this.padded(minute)}:${this.padded(second)}.000`
        );
      }
    });
  }

  padded(n: number | string | undefined, l = 2) {
    return n != null && !isNaN(+n) ? String(n).padStart(l, '0') || '' : '';
  }

  getFieldOrDefault() {
    return {
      getHours: () => (this.originalDate ? new Date(this.originalDate).getHours() : '00'),
      getMinutes: () => (this.originalDate ? new Date(this.originalDate).getMinutes() : '00'),
      getSeconds: () => (this.originalDate ? new Date(this.originalDate).getSeconds() : '00')
    };
  }

  /**
   * Note: This function is not testable because `validDate` returns a reference that can't be compared to in spec file with `hasValidator` function.
   */
  addValidators() {
    this.control?.addValidators([DateValidators.validDate(this.includeTime, this.label)]);
  }

  validate() {
    this.errors = validateDate(this.day || '', this.month || '', this.year || '', this.label);
  }

  elementHasErrors(i: number) {
    return this.day || this.month || this.year ? this.errors?.errors?.some(e => e.index === i) : false;
  }
}
