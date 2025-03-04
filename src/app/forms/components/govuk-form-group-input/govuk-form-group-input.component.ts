import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, forwardRef, inject } from '@angular/core';
import {
	ControlContainer,
	ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { NumberOnlyDirective } from '@directives/app-number-only/app-number-only.directive';
import { CustomTag, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { SharedModule } from '@shared/shared.module';

@Component({
	selector: 'govuk-form-group-input',
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, NumberOnlyDirective],
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
	@Output() blur = new EventEmitter<FocusEvent>();
	@Output() focus = new EventEmitter<FocusEvent>();

	@Input()
	value: string | number | boolean | null | undefined = null;

	@Input()
	disabled = false;

	@Input()
	tags: CustomTag[] = [];

	@Input({ alias: 'hint' })
	controlHint = '';

	@Input({ alias: 'formControlName', required: true })
	controlName = '';

	@Input({ alias: 'label' })
	controlLabel = '';

	@Input({ alias: 'id' })
	controlId = '';

	@Input({ alias: 'type' })
	controlType = 'text';

	@Input()
	width?: FormNodeWidth;

	@Input()
	maxlength: string | number | null = null;

	@Input()
	suffix?: string;

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

	get style(): string {
		return `govuk-input ${this.width ? `govuk-input--width-${this.width}` : ''}`;
	}

	onChange = (_: any) => {};
	onTouched = () => {};

	onBlur(event: FocusEvent) {
		this.onTouched();
		this.blur.emit(event);
	}

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

	protected readonly FormNodeWidth = FormNodeWidth;
}
