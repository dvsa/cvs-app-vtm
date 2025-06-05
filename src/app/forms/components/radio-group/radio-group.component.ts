import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TagComponent } from '@components/tag/tag.component';
import { FormNodeOption } from '@services/dynamic-forms/dynamic-form.types';
import { BaseControlComponent } from '../base-control/base-control.component';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';

@Component({
	selector: 'app-radio-group',
	templateUrl: './radio-group.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: RadioGroupComponent,
			multi: true,
		},
	],
	styleUrls: ['./radio-group.component.scss'],
	imports: [NgClass, TagComponent, FieldErrorMessageComponent, FormsModule],
})
export class RadioGroupComponent extends BaseControlComponent {
	readonly options = input<FormNodeOption<string | number | boolean | null>[]>([]);
	readonly inline = input(false);

	getLabel(value: string | number | boolean | null): string | undefined {
		return this.options().find((option) => option.value === value)?.label;
	}

	getId(value: string | number | boolean | null, name: string) {
		const id = `${name}-${value}-radio`;
		if (this.control?.meta) {
			this.control.meta.customId = id;
		}
		return id;
	}
}
