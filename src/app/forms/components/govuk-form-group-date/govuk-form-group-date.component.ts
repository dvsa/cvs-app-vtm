import { NumberOnlyDirective } from '@/src/app/directives/app-number-only/app-number-only.directive';
import { DateFocusNextDirective } from '@/src/app/directives/date-focus-next/date-focus-next.directive';
import { CustomTag } from '@/src/app/services/dynamic-forms/dynamic-form.types';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, forwardRef, inject, input, model, output } from '@angular/core';
import {
	ControlContainer,
	ControlValueAccessor,
	FormBuilder,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { TagDirective } from '@directives/tag/tag.directive';
import { ReplaySubject, takeUntil } from 'rxjs';
import { TagComponent } from '../../../components/tag/tag.component';

@Component({
	selector: 'govuk-form-group-date',
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TagComponent,
		TagDirective,
		DateFocusNextDirective,
		NumberOnlyDirective,
	],
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
export class GovukFormGroupDateComponent implements ControlValueAccessor, OnInit, OnDestroy {
	readonly blur = output<FocusEvent>();

	readonly focus = output<FocusEvent>();

	value = model<string | null>(null);

	readonly tags = input<CustomTag[]>([]);

	disabled = model(false);

	readonly mode = input<Format>('yyyy-mm-dd');

	readonly controlHint = input('', { alias: 'hint' });

	readonly controlName = input('', { alias: 'formControlName' });

	readonly controlLabel = input('', { alias: 'label' });

	readonly controlId = input('', { alias: 'id' });

	fb = inject(FormBuilder);
	controlContainer = inject(ControlContainer);

	form = this.fb.group({
		year: this.fb.nonNullable.control<null | number>(null),
		month: this.fb.nonNullable.control<null | number>(null),
		day: this.fb.nonNullable.control<null | number>(null),
		hours: this.fb.nonNullable.control<null | number>(null),
		minutes: this.fb.nonNullable.control<null | number>(null),
		seconds: this.fb.nonNullable.control<null | number>(null),
	});

	destroy = new ReplaySubject<boolean>(1);

	onChange = (_: any) => {};
	onTouched = () => {};

	writeValue(obj: any): void {
		this.value.set(obj);

		if (obj && typeof obj === 'string') {
			const date = new Date(obj);
			this.form.patchValue({
				year: date.getFullYear(),
				month: date.getMonth() + 1,
				day: date.getDate(),
				hours: date.getHours(),
				minutes: date.getMinutes(),
			});
		}

		this.onChange(obj);
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.disabled.set(isDisabled);
		isDisabled ? this.form.disable() : this.form.enable();
	}

	get id() {
		return this.controlId() || this.controlName();
	}

	get hintId() {
		return `${this.id}-hint`;
	}

	get errorId() {
		return `${this.id}-error`;
	}

	get control() {
		return this.controlContainer.control?.get(this.controlName());
	}

	get hasError() {
		return this.control?.invalid && this.control?.touched && this.control?.errors;
	}

	ngOnInit(): void {
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
}

type Format = 'iso' | 'yyyy-mm-dd';
