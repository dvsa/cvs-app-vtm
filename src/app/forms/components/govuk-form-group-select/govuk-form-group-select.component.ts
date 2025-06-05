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
import { MultiOptions } from '@models/options.model';
import { CustomTag, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';

@Component({
	selector: 'govuk-form-group-select',
	imports: [CommonModule, FormsModule, ReactiveFormsModule, TagComponent, TagDirective],
	templateUrl: './govuk-form-group-select.component.html',
	styleUrls: ['./govuk-form-group-select.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => GovukFormGroupSelectComponent),
			multi: true,
		},
	],
})
export class GovukFormGroupSelectComponent implements ControlValueAccessor {
	readonly blur = output<FocusEvent>();
	readonly focus = output<FocusEvent>();

	value = model<string | number | boolean | null>(null);

	disabled = model(false);

	readonly tags = input<CustomTag[]>([]);

	readonly options = input.required<MultiOptions>();

	readonly controlHint = input('', { alias: 'hint' });

	readonly controlName = input.required<string>({ alias: 'formControlName' });

	readonly controlLabel = input('', { alias: 'label' });

	readonly controlId = input('', { alias: 'id' });

	readonly allowNull = input(true);

	readonly width = input<FormNodeWidth>();

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
		return `govuk-select ${width ? `govuk-input--width-${width}` : ''}`;
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
}
