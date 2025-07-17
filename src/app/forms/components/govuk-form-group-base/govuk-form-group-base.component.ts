import { ChangeDetectorRef, Component, inject, input, model } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { CommonValidatorsService } from '@forms/validators/common-validators.service';
import { CustomTag, FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';

@Component({
	selector: 'govuk-form-group-base-component',
	template: '',
})
export class GovukFormGroupBaseComponent {
	controlContainer = inject(ControlContainer);
	cdr = inject(ChangeDetectorRef);
	commonValidators = inject(CommonValidatorsService);

	readonly tags = input<CustomTag[]>([]);

	readonly controlHint = input('', { alias: 'hint' });

	readonly controlName = input.required<string>({ alias: 'formControlName' });

	readonly controlLabel = input('', { alias: 'label' });

	readonly controlId = input('', { alias: 'id' });

	readonly isCreateMode = input(false);

	readonly controlTitle = input('', { alias: 'title' });

	readonly controlType = input('text', { alias: 'type' });

	disabled = model(false);

	readonly width = input<FormNodeWidth>();

	readonly prefix = input<string>();

	readonly warning = input<string | null>(null);

	onChange = (_: any) => {};
	onTouched = () => {};

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

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

	get hasWarning() {
		return this.control?.invalid && this.control?.touched && this.control?.errors;
	}
}
