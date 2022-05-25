import { AfterContentInit, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { CustomValidators } from '../../validators/date/date.validators';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
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
  private subscription?: Subscription;

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
    this.subscription = this.subscribeAndPropagateChanges();
  }

  override ngAfterContentInit(): void {
    super.ngAfterContentInit();
    this.addValidators();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
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
   * Subscribes to all date segments and propagates value as `Date`.
   * @returns Subscription
   */
  subscribeAndPropagateChanges() {
    return combineLatest({ day: this.day$, month: this.month$, year: this.year$ }).subscribe({
      next: ({ day, month, year }) => {
        const date = new Date(`${year}-${month}-${day}`);
        this.onChange(date);
      },
      error: (e) => console.log(e)
    });
  }

  addValidators() {
    this.control?.addValidators([CustomValidators.validDate]);
  }
}
