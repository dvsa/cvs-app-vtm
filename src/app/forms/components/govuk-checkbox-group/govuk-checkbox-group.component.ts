import { CustomTag } from '@/src/app/services/dynamic-forms/dynamic-form.types';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, forwardRef, inject } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

@Component({
	selector: 'govuk-checkbox-group',
	standalone: true,
	imports: [CommonModule, FormsModule, SharedModule],
	templateUrl: './govuk-checkbox-group.component.html',
	styleUrls: ['./govuk-checkbox-group.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => GovukCheckboxGroupComponent),
			multi: true,
		},
	],
})
export class GovukCheckboxGroupComponent implements ControlValueAccessor {
	@Output() blur = new EventEmitter<FocusEvent>();
	@Output() focus = new EventEmitter<FocusEvent>();

	@Input()
	value: unknown[] | null = null;

	@Input()
	disabled = false;

	@Input()
	tags: CustomTag[] = [];

	@Input({ required: true })
	options!: { value: any; label: string }[];

	@Input({ alias: 'hint' })
	controlHint = '';

	@Input({ alias: 'formControlName' })
	controlName = '';

	@Input({ alias: 'label' })
	controlLabel = '';

	@Input({ alias: 'id' })
	controlId = '';

	controlContainer = inject(ControlContainer);

	get control() {
		return this.controlContainer.control?.get(this.controlName);
	}

	get id() {
		return this.controlId || this.controlName;
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

	onChange = (_: any) => {};
	onTouched = () => {};

	writeValue(obj: any): void {
		this.value = obj;
		this.onChange(obj);
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	toggle(option: any) {
		const value = this.value;

		if (!value) {
			this.value = [option];
			this.onChange(this.value);
			return;
		}

		const arr = [...value];
		arr.includes(option) ? arr.splice(arr.indexOf(option), 1) : arr.push(option);
		this.value = arr;
		this.onChange(this.value);
	}

	isChecked(value: unknown) {
		return this.value?.includes(value?.toString());
	}
}
