import { NumberOnlyDirective } from '@/src/app/directives/app-number-only/app-number-only.directive';
import { CommonModule } from '@angular/common';

import { Component, OnDestroy, OnInit, forwardRef, inject, input, model, output } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TagComponent } from '@components/tag/tag.component';
import { parseAsUtc } from '@forms/components/date/parse-as-utc';
import { GovukFormGroupBaseComponent } from '@forms/components/govuk-form-group-base/govuk-form-group-base.component';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
	selector: 'govuk-form-group-date',
	imports: [CommonModule, FormsModule, ReactiveFormsModule, TagComponent, NumberOnlyDirective],
	templateUrl: './govuk-form-group-date.component.html',
	styleUrls: ['./govuk-form-group-date.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => GovukFormGroupDateComponent),
			multi: true,
		},
	],
})
export class GovukFormGroupDateComponent
	extends GovukFormGroupBaseComponent
	implements ControlValueAccessor, OnInit, OnDestroy
{
	readonly blur = output<FocusEvent>();

	readonly focus = output<FocusEvent>();

	value = model<string | null>(null);

	readonly mode = input<Format>('yyyy-mm-dd');

	fb = inject(FormBuilder);

	form = this.fb.group({
		year: this.fb.nonNullable.control<null | number>(null),
		month: this.fb.nonNullable.control<null | number>(null),
		day: this.fb.nonNullable.control<null | number>(null),
		hours: this.fb.nonNullable.control<null | number>(null),
		minutes: this.fb.nonNullable.control<null | number>(null),
		seconds: this.fb.nonNullable.control<null | number>(null),
	});

	readonly maxLength = {
		day: 2,
		month: 2,
		year: 4,
		hours: 2,
		minutes: 2,
	} as const;

	destroy = new ReplaySubject<boolean>(1);

	writeValue(obj: any): void {
		this.value.set(obj);

		if (obj && typeof obj === 'string') {
			const date = parseAsUtc(obj);
			// Date-only values are read in UTC so the calendar day doesn't shift during BST.
			// ISO mode shows a time, so it is displayed in the user's local time.
			const local = this.mode() === 'iso';
			this.form.patchValue({
				year: local ? date.getFullYear() : date.getUTCFullYear(),
				month: (local ? date.getMonth() : date.getUTCMonth()) + 1,
				day: local ? date.getDate() : date.getUTCDate(),
				hours: local ? date.getHours() : date.getUTCHours(),
				minutes: local ? date.getMinutes() : date.getUTCMinutes(),
				seconds: local ? date.getSeconds() : date.getUTCSeconds(),
			});
		}

		this.onChange(obj);
	}

	override setDisabledState(isDisabled: boolean): void {
		this.disabled.set(isDisabled);
		isDisabled ? this.form.disable() : this.form.enable();
	}

	get style(): string {
		const errorClass = this.hasError ? 'govuk-input--error' : '';
		return errorClass.trim();
	}

	override ngOnInit(): void {
		super.ngOnInit();

		// Ensure events of children are propagated to the parent
		this.form.events.pipe(takeUntil(this.destroy)).subscribe((value) => {
			if ('touched' in value && value.touched) {
				this.onTouched();
			}
		});

		// Map the separate form controls to a single date string
		this.form.valueChanges.pipe(takeUntil(this.destroy)).subscribe(() => {
			const { year, month, day, hours, minutes, seconds } = this.form.value;

			if (year === null && month === null && day === null) {
				this.onChange(null);
				return;
			}

			const dayStr = day?.toString().padStart(2, '0');
			const monthStr = month?.toString().padStart(2, '0');

			switch (this.mode()) {
				case 'iso': {
					const hoursStr = this.pad(hours);
					const minsStr = this.pad(minutes);
					const secsStr = this.pad(seconds);
					this.onChange(
						this.toUtcIso(year, month, day, hours, minutes, seconds ?? 0) ??
							`${year}-${monthStr}-${dayStr}T${hoursStr}:${minsStr}:${secsStr || '00'}.000`
					);
					break;
				}
				case 'iso-date': {
					// Only the date is editable, the original time of day (in UTC) is kept
					const date = `${year}-${monthStr}-${dayStr}`;
					const time = `${this.pad(hours ?? 0)}:${this.pad(minutes ?? 0)}:${this.pad(seconds ?? 0)}`;
					this.onChange(this.isValidUtcDate(year, month, day) ? `${date}T${time}.000Z` : date);
					break;
				}
				default: {
					this.onChange(`${year}-${monthStr}-${dayStr}`);
				}
			}
		});
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}

	onDateInput(event: Event, field: 'day' | 'month' | 'year' | 'hours' | 'minutes') {
		const input = event.target as HTMLInputElement | null;
		if (!input) return;
		let val = input.value ?? '';

		// Remove any non-digit characters (defensive)
		val = val.replace(/\D+/g, '');

		const max = this.maxLength[field as keyof typeof this.maxLength];
		if (val.length > max) {
			val = val.slice(0, max);
			// update the visible input value
			input.value = val;
		}

		const parsed = val === '' ? null : Number(val);
		// Update form control with parsed number (or null) and allow valueChanges to run
		this.form.get(field)?.setValue(parsed, { emitEvent: true });
	}

	/**
	 * Converts a complete, valid local date and time to a UTC ISO string.
	 * Returns undefined for incomplete or invalid input so it can be passed through for validation.
	 */
	toUtcIso(
		year: number | null | undefined,
		month: number | null | undefined,
		day: number | null | undefined,
		hours: number | null | undefined,
		minutes: number | null | undefined,
		seconds: number | null | undefined
	): string | undefined {
		if (year == null || month == null || day == null || hours == null || minutes == null || seconds == null) {
			return undefined;
		}
		if (String(year).length !== 4) {
			return undefined;
		}
		const date = new Date(year, month - 1, day, hours, minutes, seconds);
		const isValid =
			date.getFullYear() === year &&
			date.getMonth() === month - 1 &&
			date.getDate() === day &&
			date.getHours() === hours &&
			date.getMinutes() === minutes &&
			date.getSeconds() === seconds;
		return isValid ? date.toISOString() : undefined;
	}

	isValidUtcDate(year: number | null | undefined, month: number | null | undefined, day: number | null | undefined) {
		if (year == null || month == null || day == null || String(year).length !== 4) {
			return false;
		}
		const date = new Date(Date.UTC(year, month - 1, day));
		return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
	}

	pad(number: number | null | undefined, length = 2) {
		return number != null && !Number.isNaN(+number) ? String(number).padStart(length, '0') || '' : '';
	}
}

/**
 * - `iso`: date and time inputs in local time, emits a UTC ISO string
 * - `iso-date`: date inputs only, emits a UTC ISO string keeping the original time of day
 * - `yyyy-mm-dd`: date inputs only, emits a date string
 */
type Format = 'iso' | 'iso-date' | 'yyyy-mm-dd';
