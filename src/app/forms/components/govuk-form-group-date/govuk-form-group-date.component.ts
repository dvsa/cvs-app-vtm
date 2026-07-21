import { NumberOnlyDirective } from '@/src/app/directives/app-number-only/app-number-only.directive';
import { CommonModule } from '@angular/common';

import { Component, OnDestroy, OnInit, forwardRef, inject, input, model, output } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { TagComponent } from '@components/tag/tag.component';
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

	destroy = new ReplaySubject<boolean>(1);

	writeValue(obj: any): void {
		this.value.set(obj);

		if (obj && typeof obj === 'string') {
			const date = new Date(obj);
			this.form.patchValue({
				year: date.getUTCFullYear(),
				month: date.getUTCMonth() + 1,
				day: date.getUTCDate(),
				hours: date.getUTCHours(),
				minutes: date.getUTCMinutes(),
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
					this.onChange(
						new Date(
							year as number,
							(month as number) - 1,
							day as number,
							Number(hoursStr) || 0,
							Number(minsStr) || 0,
							Number(secsStr) || 0
						).toISOString()
					);
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
