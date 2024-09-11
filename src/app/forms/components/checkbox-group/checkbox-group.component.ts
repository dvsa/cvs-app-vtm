import { Component, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormNodeOption } from '@services/dynamic-forms/dynamic-form.types';
import { BaseControlComponent } from '../base-control/base-control.component';

type OptionsType = string | number | boolean;
@Component({
	selector: 'app-checkbox-group',
	templateUrl: './checkbox-group.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: CheckboxGroupComponent,
			multi: true,
		},
	],
})
export class CheckboxGroupComponent extends BaseControlComponent {
	@Input() options: FormNodeOption<OptionsType>[] = [];
	@Input() delimited?: { regex?: string; separator: string };

	isChecked(option: string | number | boolean): boolean {
		return this.value && this.value.includes(option);
	}

	handleChange(event: boolean, option: FormNodeOption<OptionsType>): void {
		return event ? this.add(option) : this.remove(option);
	}

	private add(option: FormNodeOption<OptionsType>) {
		if (!this.value) {
			this.value = this.delimited ? option.value : [option.value];
		} else {
			this.value = this.value.concat(this.delimited ? `${this.delimited.separator}${option.value}` : option.value);
		}

		this.onChange(this.value);
	}

	private remove(option: FormNodeOption<OptionsType>) {
		const seperator = this.delimited?.regex ? new RegExp(this.delimited.regex) : this.delimited?.separator;

		let filtered: string[] = [];
		let newValue: string[] | string | null = null;

		// if we can, split the string value into pieces by the seperator
		if (typeof this.value === 'string' && seperator) {
			filtered = this.value.split(seperator);
		}

		// otherwise, if the value is an array, just use it
		if (Array.isArray(this.value)) {
			filtered = this.value;
		}

		// remove invalid options
		filtered = filtered.filter((v) => v !== option.value);

		// if we used a seperator, join the pieces back together (as this implies the value is a string)
		newValue = seperator ? filtered.join(this.delimited?.separator) : filtered;

		// prevent empty strings or arrays, represent these as null
		if (newValue?.length === 0) {
			newValue = null;
		}

		this.value = newValue;
		this.onChange(this.value);
	}

	trackByFn(i: number) {
		return i;
	}
}
