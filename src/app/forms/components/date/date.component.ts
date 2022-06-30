import { AfterContentInit, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { combineLatest, distinctUntilChanged, Observable, of, Subject, Subscription, takeWhile } from 'rxjs';
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
  private day_: Subject<number> = new Subject();
  private month_: Subject<number> = new Subject();
  private year_: Subject<number> = new Subject();
  private day$: Observable<number>;
  private month$: Observable<number>;
  private year$: Observable<number>;
  private subscriptions: Array<Subscription> = [];

  public day?: number;
  public month?: number;
  public year?: number;

  constructor(injector: Injector) {
    super(injector);
    this.day$ = this.day_.asObservable();
    this.month$ = this.month_.asObservable();
    this.year$ = this.year_.asObservable();
  }

  ngOnInit(): void {
    this.subscriptions.push(this.subscribeAndPropagateChanges());
  }

  override ngAfterContentInit(): void {
    super.ngAfterContentInit();
    this.addValidators();
    this.subscriptions.push(this.watchValue());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
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

  /**
   * subscribe to value and propagate to date segments
   */
  watchValue() {
    return of(this.control?.value)
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value && typeof value === 'string') {
          const date = new Date(value);
          this.day = date.getDate();
          this.day_.next(this.day);
          this.month = date.getMonth() + 1;
          this.month_.next(this.month);
          this.year = date.getFullYear();
          this.year_.next(this.year);
        }
      });
  }

  /**
   * Subscribes to all date segments and propagates value as `Date`.
   * @returns Subscription
   */
  subscribeAndPropagateChanges() {
    return combineLatest({ day: this.day$, month: this.month$, year: this.year$ }).subscribe({
      next: ({ day, month, year }) => {
        if (!day || !month || !year) {
          this.onChange(null);
          return;
        }

        const date = new Date(`${year}-${month}-${day}`);
        this.onChange(date);
      }
    });
  }

  addValidators() {
    this.control?.addValidators([DateValidators.validDate]);
  }
}
