import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TagComponent } from '@components/tag/tag.component';
import { FormNodeOption } from '@services/dynamic-forms/dynamic-form.types';
import { BaseControlComponent } from '../base-control/base-control.component';
import { FieldErrorMessageComponent } from '../field-error-message/field-error-message.component';

@Component({
	selector: 'app-select[options]',
	templateUrl: './select.component.html',
	styleUrls: ['./select.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: SelectComponent,
			multi: true,
		},
	],
	imports: [NgClass, TagComponent, FieldErrorMessageComponent, FormsModule],
})
export class SelectComponent extends BaseControlComponent {
	readonly options = input.required<Array<FormNodeOption<string | number | boolean>>>();
	readonly blur = output<FocusEvent>();

	get style(): string {
		const width = this.width();
		return `govuk-select ${width ? `govuk-input--width-${width}` : ''}`;
	}
}
