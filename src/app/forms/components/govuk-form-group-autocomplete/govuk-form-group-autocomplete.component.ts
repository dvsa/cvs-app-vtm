import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, forwardRef, inject } from '@angular/core';
import {
	ControlContainer,
	ControlValueAccessor,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
} from '@angular/forms';
import { CustomValidators } from '@forms/validators/custom-validators/custom-validators';
import { MultiOption } from '@models/options.model';
import { CustomTag, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { SharedModule } from '@shared/shared.module';

@Component({
	selector: 'govuk-form-group-autocomplete',
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
	templateUrl: './govuk-form-group-autocomplete.component.html',
	styleUrls: ['./govuk-form-group-autocomplete.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => GovukFormGroupAutocompleteComponent),
			multi: true,
		},
	],
})
export class GovukFormGroupAutocompleteComponent implements ControlValueAccessor {
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

	@Input()
	allowNull = true;

	@Input()
	width?: FormNodeWidth;

	@Input() noBottomMargin = false;

	controlContainer = inject(ControlContainer);
	cdr = inject(ChangeDetectorRef);

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
		return `autocomplete__wrapper${this.noBottomMargin ? '' : ' extra-margin'}`;
	}

	get innerStyle(): string {
		return this.width ? ` govuk-input--width-${this.width}` : ' internal-wrapper';
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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handleChange(event: any) {
		const {
			target: { value },
		} = event;

		this.handleChangeForOption(value);
	}

	handleChangeForOption(value: string) {
		const optionValue = this.findOptionValue(value);

		this.control?.patchValue(optionValue ?? '[INVALID_OPTION]');
		this.control?.markAsTouched();
		this.control?.updateValueAndValidity();
		this.cdr.detectChanges();
	}

	/**
	 * Takes the value from the autocomplete element and looks for a matching option in the options array.
	 * Returns the found value or undefined if no match.
	 * If value is empty, returns `''`.
	 * @param value - value to get option for
	 * @returns `string | undefined`
	 */
	findOptionValue(label: string) {
		return label ? this.options.find((option) => option.label === label)?.value : '';
	}

	addValidators() {
		this.control?.addValidators([CustomValidators.invalidOption]);
	}
}
