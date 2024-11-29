import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, forwardRef, inject } from '@angular/core';
import {
	ControlContainer,
	ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { MultiOption } from '@models/options.model';
import { CustomTag } from '@services/dynamic-forms/dynamic-form.types';
import { SharedModule } from '@shared/shared.module';

@Component({
	selector: 'govuk-form-group-select',
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
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
	@Output() blur = new EventEmitter<FocusEvent>();
	@Output() focus = new EventEmitter<FocusEvent>();

	@Input()
	value: string | number | boolean | null = null;

	@Input()
	disabled = false;

	@Input()
	tags: CustomTag[] = [];

	@Input({ required: true })
	options!: MultiOption[];

	@Input({ alias: 'hint' })
	controlHint = '';

	@Input({ alias: 'formControlName', required: true })
	controlName = '';

	@Input({ alias: 'label', required: true })
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
}
