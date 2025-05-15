import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, input, model, output } from '@angular/core';
import {
	ControlContainer,
	ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { NumberOnlyDirective } from '@directives/app-number-only/app-number-only.directive';
import { CustomTag, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';

import { NoEmojisDirective } from '@/src/app/directives/no-emojis/no-emojis.directive';
import { TagDirective } from '@directives/tag/tag.directive';
import { TagComponent } from '../../../components/tag/tag.component';

@Component({
	selector: 'govuk-form-group-input',
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TagComponent,
		TagDirective,
		NumberOnlyDirective,
		NoEmojisDirective,
	],
	templateUrl: './govuk-form-group-input.component.html',
	styleUrls: ['./govuk-form-group-input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => GovukFormGroupInputComponent),
			multi: true,
		},
	],
})
export class GovukFormGroupInputComponent implements ControlValueAccessor {
	readonly blur = output<FocusEvent>();
	readonly focus = output<FocusEvent>();

	value = model<string | number | boolean | null | undefined>(null);

	disabled = model(false);

	readonly tags = input<CustomTag[]>([]);

	readonly controlHint = input('', { alias: 'hint' });

	readonly controlName = input.required<string>({ alias: 'formControlName' });

	readonly controlLabel = input('', { alias: 'label' });

	readonly controlId = input('', { alias: 'id' });

	readonly controlType = input('text', { alias: 'type' });

	readonly width = input<FormNodeWidth>();

	readonly maxlength = input<string | number | null>(null);

	readonly suffix = input<string>();

	controlContainer = inject(ControlContainer);

	get control() {
		return this.controlContainer.control?.get(this.controlName());
	}

	get id() {
		return this.controlId() || this.controlName();
	}

	get hintId() {
		return `${this.id}-hint`;
	}

	get labelId() {
		return `${this.id}-label`;
	}

	get errorId() {
		return `${this.id}-error`;
	}

	get hasError() {
		return this.control?.invalid && this.control?.touched && this.control?.errors;
	}

	get style(): string {
		const width = this.width();
		return `govuk-input ${width ? `govuk-input--width-${width}` : ''}`;
	}

	onChange = (event: any) => {};
	onTouched = () => {};

	onBlur(event: FocusEvent) {
		this.onTouched();
		this.blur.emit(event);
	}

	writeValue(obj: any): void {
		this.value.set(obj);
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
	}

	protected readonly FormNodeWidth = FormNodeWidth;
}
