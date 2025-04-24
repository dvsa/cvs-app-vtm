import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, input, model, output } from '@angular/core';
import {
	ControlContainer,
	ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { CustomTag, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';

import { NoEmojisDirective } from '@/src/app/directives/no-emojis/no-emojis.directive';
import { TagDirective } from '@directives/tag/tag.directive';
import { TagComponent } from '../../../components/tag/tag.component';

@Component({
	selector: 'govuk-form-group-textarea',
	imports: [CommonModule, FormsModule, ReactiveFormsModule, TagComponent, TagDirective, NoEmojisDirective],
	templateUrl: './govuk-form-group-textarea.component.html',
	styleUrls: ['./govuk-form-group-textarea.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => GovukFormGroupTextareaComponent),
			multi: true,
		},
	],
})
export class GovukFormGroupTextareaComponent implements ControlValueAccessor {
	readonly blur = output<FocusEvent>();
	readonly focus = output<FocusEvent>();

	value = model<string | null | undefined>(null);

	disabled = model(false);

	readonly tags = input<CustomTag[]>([]);

	readonly controlHint = input('', { alias: 'hint' });

	readonly controlName = input.required<string>({ alias: 'formControlName' });

	readonly controlLabel = input.required<string>({ alias: 'label' });

	readonly controlId = input('', { alias: 'id' });

	readonly controlType = input('text', { alias: 'type' });

	readonly width = input<FormNodeWidth>();

	readonly maxLength = input<number | null>(null);

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

	get length() {
		return this.value()?.length ?? 0;
	}

	onChange = (event: any) => {};

	onTouched = () => {};

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
