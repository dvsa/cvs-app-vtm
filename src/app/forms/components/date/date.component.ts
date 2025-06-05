import { NgClass } from '@angular/common';
/* eslint-disable no-underscore-dangle */
import { AfterContentInit, Component, OnDestroy, OnInit, inject, input, output, viewChild } from '@angular/core';
import { AbstractControlDirective, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TagComponent } from '@components/tag/tag.component';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { NumberOnlyDirective } from '@directives/app-number-only/app-number-only.directive';
import { DateFocusNextDirective } from '@directives/date-focus-next/date-focus-next.directive';
import { ValidatorNames } from '@models/validators.enum';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import validateDate from 'validate-govuk-date';
import { DateValidators } from '../../validators/date/date.validators';
import { BaseControlComponent } from '../base-control/base-control.component';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';

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
			multi: true,
		},
	],
	imports: [
		TagComponent,
		FieldErrorMessageComponent,
		FormsModule,
		NumberOnlyDirective,
		DateFocusNextDirective,
		NgClass,
	],
})
export class DateComponent extends BaseControlComponent implements OnInit, OnDestroy, AfterContentInit {
	globalErrorService = inject(GlobalErrorService);

	readonly displayTime = input(false);
	readonly isoDate = input(true);
	readonly customError = input<boolean | undefined>(false);
	readonly dayModel = viewChild<AbstractControlDirective>('dayModel');
	readonly blur = output<FocusEvent>();

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
	public originalDate = '';
	public errors?: { error: boolean; date?: Date; errors?: { error: boolean; reason: string; index: number }[] };
	private dateFieldOrDefault?: Record<'hours' | 'minutes' | 'seconds', string | number>;
	protected formSubmitted? = false;

	public day?: number;
	public month?: number;
	public year?: number;
	public hour?: number;
	public minute?: number;

	dayId = '';
	monthId = '';
	yearId = '';

	constructor() {
		super();
		this.day$ = this.day_.asObservable();
		this.month$ = this.month_.asObservable();
		this.year$ = this.year_.asObservable();
		this.hour$ = this.hour_.asObservable();
		this.minute$ = this.minute_.asObservable();
		this.globalErrorService.errors$.subscribe((globalErrors) => {
			if (globalErrors.length) {
				this.formSubmitted = true;
			}
		});
	}

	ngOnInit(): void {
		this.subscriptions.push(this.subscribeAndPropagateChanges());
		this.dayId = `${this.customId() ?? this.name()}-day`;
		this.monthId = `${this.customId() ?? this.name()}-month`;
		this.yearId = `${this.customId() ?? this.name()}-year`;
	}

	override ngAfterContentInit(): void {
		super.ngAfterContentInit();
		this.originalDate = this.value;
		this.dateFieldOrDefault = {
			hours: this.originalDate ? new Date(this.originalDate).getHours() : '00',
			minutes: this.originalDate ? new Date(this.originalDate).getMinutes() : '00',
			seconds: this.originalDate ? new Date(this.originalDate).getSeconds() : '00',
		};
		this.addValidators();
		this.valueWriteBack(this.value);
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach((s) => s && s.unsubscribe());
	}

	onDayChange(event: number | undefined) {
		this.day_.next(event);
	}

	onMonthChange(event: number | undefined) {
		this.month_.next(event);
	}

	onYearChange(event: number | undefined) {
		this.year_.next(event);
	}

	onHourChange(event: number | undefined) {
		this.hour_.next(event);
	}

	onMinuteChange(event: number | undefined) {
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
		const dateFields: Segments = this.displayTime()
			? {
					day: this.day$,
					month: this.month$,
					year: this.year$,
					hour: this.hour$,
					minute: this.minute$,
				}
			: { day: this.day$, month: this.month$, year: this.year$ };
		return combineLatest(dateFields).subscribe({
			next: ({ day, month, year, hour, minute }) => {
				if (!day && !month && !year && !hour && !minute) {
					this.onChange(null);
					return;
				}
				hour = this.displayTime() ? hour : this.dateFieldOrDefault?.hours;
				minute = this.displayTime() ? minute : this.dateFieldOrDefault?.minutes;
				const second = this.dateFieldOrDefault?.seconds;
				this.onChange(this.processDate(year, month, day, hour, minute, second));
			},
		});
	}

	processDate(
		year: number | string | undefined,
		month: number | string | undefined,
		day: number | string | undefined,
		hour: number | string | undefined,
		minute: number | string | undefined,
		second: number | string | undefined
	) {
		if (this.isoDate()) {
			return `${year || ''}-${this.padded(month)}-${this.padded(day)}T${this.padded(hour)}:${this.padded(minute)}:${this.padded(second)}.000`;
		}
		return `${year || ''}-${this.padded(month)}-${this.padded(day)}`;
	}

	padded(n: number | string | undefined, l = 2) {
		return n != null && !Number.isNaN(+n) ? String(n).padStart(l, '0') || '' : '';
	}

	/**
	 * Note: This function is not testable because `validDate` returns a reference that can't be compared to in spec file with `hasValidator` function.
	 */
	addValidators() {
		const label = this.label();
		const displayTime = this.displayTime();
		this.control?.addValidators([DateValidators.validDate(displayTime, label)]);
		this.control?.meta.validators?.push({
			name: ValidatorNames.Custom,
			args: DateValidators.validDate(displayTime, label),
		});
	}

	validate() {
		this.errors = validateDate(this.day || '', this.month || '', this.year || '', this.label());
	}

	elementHasErrors(i: number) {
		return this.day || this.month || this.year ? this.errors?.errors?.some((e) => e.index === i) : false;
	}

	getId(name: string) {
		const id = `${name}-day`;
		if (this.control) {
			this.control.meta.customId = id;
		}
		return id;
	}
}
