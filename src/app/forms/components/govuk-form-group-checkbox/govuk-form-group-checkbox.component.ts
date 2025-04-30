import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, input, model, output } from '@angular/core';
import {
	ControlContainer,
	ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { TagComponent } from '@components/tag/tag.component';
import { TagDirective } from '@directives/tag/tag.directive';
import { CustomTag, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';

@Component({
	selector: 'govuk-form-group-checkbox',
	imports: [CommonModule, FormsModule, ReactiveFormsModule, TagComponent, TagDirective],
	templateUrl: './govuk-form-group-checkbox.component.html',
	styleUrls: ['./govuk-form-group-checkbox.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => GovukFormGroupCheckboxComponent),
			multi: true,
		},
	],
})
export class GovukFormGroupCheckboxComponent implements ControlValueAccessor {
	readonly blur = output<FocusEvent>();
	readonly focus = output<FocusEvent>();

	value = model<string | number | boolean | null | undefined>(null);

	disabled = model(false);

	readonly tags = input<CustomTag[]>([]);

	readonly controlHint = input('', { alias: 'hint' });

	readonly controlName = input.required<string>({ alias: 'formControlName' });

	readonly controlLabel = input('', { alias: 'label' });

	readonly controlTitle = input('', { alias: 'title' });

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
}
