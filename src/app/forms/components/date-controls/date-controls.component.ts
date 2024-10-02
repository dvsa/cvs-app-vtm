import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import {
	ControlContainer,
	ControlValueAccessor,
	FormBuilder,
	NG_VALUE_ACCESSOR,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-date-controls',
	templateUrl: './date-controls.component.html',
	styleUrls: ['./date-controls.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: DateControlsComponent,
		},
	],
})
export class DateControlsComponent implements ControlValueAccessor, OnInit, OnDestroy {
	fb = inject(FormBuilder);
	controlContainer = inject(ControlContainer);
	globalErrorService = inject(GlobalErrorService);

	mode = input<Format>('yyyy-mm-dd');
	formControlName = input.required<string>();

	form = this.fb.group({
		year: this.fb.nonNullable.control<null | number>(null, [this.min(1000, 'Year'), this.max(9999, 'Year')]),
		month: this.fb.nonNullable.control<null | number>(null, [this.min(1, 'Month'), this.max(12, 'Month')]),
		day: this.fb.nonNullable.control<null | number>(null, [this.min(1, 'Day'), this.max(31, 'Day')]),
		hours: this.fb.nonNullable.control<null | number>(null),
		minutes: this.fb.nonNullable.control<null | number>(null),
		seconds: this.fb.nonNullable.control<null | number>(null),
	});

	destroy = new ReplaySubject<boolean>(1);

	onTouch: () => void = () => {};
	onChange: (value: any) => void = () => {};

	writeValue(obj: any): void {
		if (typeof obj === 'string') {
			this.writeDate(new Date(obj));
		}

		if (typeof obj === 'object' && obj instanceof Date) {
			this.writeDate(obj);
		}
	}

	writeDate(date: Date) {
		this.form.setValue({
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate(),
			hours: date.getHours(),
			minutes: date.getMinutes(),
			seconds: date.getSeconds(),
		});
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouch = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		isDisabled ? this.form.disable() : this.form.enable();
	}

	ngOnInit(): void {
		// Ensure events of children are propagated to the parent
		this.form.events.pipe(takeUntil(this.destroy)).subscribe((value) => {
			if ('touched' in value && value.touched) {
				this.onTouch();
			}
		});

		// Ensure form errors are propagated to the parent
		this.form.statusChanges.pipe(takeUntil(this.destroy)).subscribe(() => {
			const control = this.controlContainer.control?.get(this.formControlName());
			if (control) {
				this.form.updateValueAndValidity({ onlySelf: true, emitEvent: false });
				const errors = this.globalErrorService.extractErrors(this.form);
				control.setErrors({ ...control.errors, ...errors });
			}
		});

		// Map the seperate form controls to a single date string
		this.form.valueChanges.pipe(takeUntil(this.destroy)).subscribe(() => {
			const { year, month, day, hours, minutes, seconds } = this.form.value;

			if (year === null && month === null && day === null) {
				this.onChange(null);
				return;
			}

			const monthStr = month?.toString().padStart(2, '0');
			const dayStr = day?.toString().padStart(2, '0');
			const hoursStr = hours?.toString().padStart(2, '0');
			const minsStr = minutes?.toString().padStart(2, '0');
			const secsStr = seconds?.toString().padStart(2, '0');

			switch (this.mode()) {
				case 'iso':
					this.onChange(`${year}-${monthStr}-${dayStr}T${hoursStr || '00'}:${minsStr || '00'}:${secsStr || '00'}`);
					break;
				default:
					this.onChange(`${year}-${monthStr}-${dayStr}`);
			}
		});
	}

	ngOnDestroy(): void {
		this.destroy.next(true);
		this.destroy.complete();
	}

	min(min: number, label: string): ValidatorFn {
		return (control) => {
			return Validators.min(min)(control) ? { min: `${label} must be greater than or equal to ${min}` } : null;
		};
	}

	max(max: number, label: string): ValidatorFn {
		return (control) => {
			return Validators.max(max)(control) ? { max: `${label} must be less than or equal to ${max}` } : null;
		};
	}
}

type Format = 'iso' | 'yyyy-mm-dd';
