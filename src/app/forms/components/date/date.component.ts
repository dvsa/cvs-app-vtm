import { NgClass } from '@angular/common';
/* eslint-disable no-underscore-dangle */
import {
	AfterContentInit,
	Component,
	OnDestroy,
	OnInit,
	inject,
	input,
	output,
	signal,
	viewChild,
} from '@angular/core';
import { AbstractControlDirective, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TagComponent } from '@components/tag/tag.component';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { NumberOnlyDirective } from '@directives/app-number-only/app-number-only.directive';
import { ValidatorNames } from '@models/validators.enum';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import validateDate from 'validate-govuk-date';
import { DateValidators } from '../../validators/date/date.validators';
import { BaseControlComponent } from '../base-control/base-control.component';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';
import { parseAsUtc } from './parse-as-utc';

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
	imports: [TagComponent, FieldErrorMessageComponent, FormsModule, NumberOnlyDirective, NgClass],
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
	protected readonly formSubmitted = signal(false);

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
				this.formSubmitted.set(true);
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
		// Date-only fields keep the original time of day, read in UTC so it is written back unchanged
		this.dateFieldOrDefault = {
			hours: this.originalDate ? parseAsUtc(this.originalDate).getUTCHours() : '00',
			minutes: this.originalDate ? parseAsUtc(this.originalDate).getUTCMinutes() : '00',
			seconds: this.originalDate ? parseAsUtc(this.originalDate).getUTCSeconds() : '00',
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
			const date = parseAsUtc(value);
			// Date-only fields are read in UTC so the calendar day doesn't shift during BST.
			// Fields that display a time are shown in the user's local time.
			const local = this.displayTime();
			this.day = local ? date.getDate() : date.getUTCDate();
			this.day_.next(this.day);
			this.month = (local ? date.getMonth() : date.getUTCMonth()) + 1;
			this.month_.next(this.month);
			this.year = local ? date.getFullYear() : date.getUTCFullYear();
			this.year_.next(this.year);
			this.hour = local ? date.getHours() : date.getUTCHours();
			this.hour_.next(this.hour);
			this.minute = local ? date.getMinutes() : date.getUTCMinutes();
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
			const raw = `${year || ''}-${this.padded(month)}-${this.padded(day)}T${this.padded(hour)}:${this.padded(minute)}:${this.padded(second)}.000`;
			if (!this.isCompleteDate(year, month, day, hour, minute, second)) {
				// Leave incomplete/invalid input untouched so the date validator can report it
				return raw;
			}
			if (this.displayTime()) {
				// Time was entered in local time, convert to UTC
				return new Date(+year!, +month! - 1, +day!, +hour!, +minute!, +second!).toISOString();
			}
			return `${raw}Z`;
		}
		return `${year || ''}-${this.padded(month)}-${this.padded(day)}`;
	}

	private isCompleteDate(
		year: number | string | undefined,
		month: number | string | undefined,
		day: number | string | undefined,
		hour: number | string | undefined,
		minute: number | string | undefined,
		second: number | string | undefined
	): boolean {
		const parts = [year, month, day, hour, minute, second];
		if (parts.some((p) => p == null || p === '' || Number.isNaN(+p)) || String(year).length !== 4) {
			return false;
		}
		const date = new Date(Date.UTC(+year!, +month! - 1, +day!, +hour!, +minute!, +second!));
		return (
			date.getUTCFullYear() === +year! &&
			date.getUTCMonth() === +month! - 1 &&
			date.getUTCDate() === +day! &&
			date.getUTCHours() === +hour! &&
			date.getUTCMinutes() === +minute! &&
			date.getUTCSeconds() === +second!
		);
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

	readonly maxLength = {
		day: 2,
		month: 2,
		year: 4,
		hour: 2,
		minute: 2,
	} as const;

	onDateInput(event: Event, field: 'day' | 'month' | 'year' | 'hour' | 'minute') {
		const input = event.target as HTMLInputElement | null;
		if (!input) return;
		let val = input.value ?? '';
		val = val.replace(/\D+/g, '');

		const max = this.maxLength[field];
		if (val.length > max) {
			val = val.slice(0, max);
			input.value = val;
		}

		const parsed = val === '' ? undefined : Number(val);
		switch (field) {
			case 'day':
				this.day = parsed;
				this.onDayChange(parsed);
				break;
			case 'month':
				this.month = parsed;
				this.onMonthChange(parsed);
				break;
			case 'year':
				this.year = parsed;
				this.onYearChange(parsed);
				break;
			case 'hour':
				this.hour = parsed;
				this.onHourChange(parsed);
				break;
			case 'minute':
				this.minute = parsed;
				this.onMinuteChange(parsed);
				break;
		}
	}
}
