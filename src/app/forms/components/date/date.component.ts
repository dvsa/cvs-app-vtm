import { AfterContentInit, ChangeDetectorRef, Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { DateValidators } from '../../validators/date/date.validators';
import { BaseControlComponent } from '../base-control/base-control.component';

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

  private day_: Subject<number> = new Subject();
  private month_: Subject<number> = new Subject();
  private year_: Subject<number> = new Subject();
  private hour_: Subject<number> = new Subject();
  private minute_: Subject<number> = new Subject();
  private day$: Observable<number>;
  private month$: Observable<number>;
  private year$: Observable<number>;
  private hour$: Observable<number>;
  private minute$: Observable<number>;
  private subscriptions: Array<Subscription | undefined> = [];
  public originalDate: string = '';

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
      this.hour = date.getUTCHours();
      this.hour_.next(this.hour);
      this.minute = date.getUTCMinutes();
      this.minute_.next(this.minute);
    }
  }

  /**
   * Subscribes to all date segments and propagates value as `Date`.
   * @returns Subscription
   */
  subscribeAndPropagateChanges() {
    return combineLatest({ day: this.day$, month: this.month$, year: this.year$, hour: this.hour$, minute: this.minute$ }).subscribe({
      next: ({ day, month, year, hour, minute }) => {
        if (!day || !month || !year || (this.includeTime && (!hour || !minute))) {
          this.onChange(null);
          return;
        }

        const date = new Date(Date.UTC(year, month - 1, day));

        hour = hour ?? new Date(this.originalDate).getUTCHours();
        minute = minute ?? new Date(this.originalDate).getUTCMinutes();
        const second = new Date(this.originalDate).getUTCSeconds();

        if ('Invalid Date' !== date.toString()) {
          date.setUTCHours(hour || 0);
          date.setUTCMinutes(minute || 0);
          date.setUTCSeconds(second || 0);
        }

        this.onChange(date);
      }
    });
  }

  addValidators() {
    this.control?.addValidators([DateValidators.validDate]);
  }
}
