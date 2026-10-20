import { Directive, input, model } from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';

@Directive({
	selector: '[appCustomFormControl]',
})
export class CustomFormControlDirective<T> implements FormValueControl<T> {
	readonly value = model.required<T>();
	readonly disabled = model(false);
	readonly invalid = input(false);
	readonly touched = model(false);
	readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
}
