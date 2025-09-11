import { Component, forwardRef, inject, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GovukFormGroupRadioComponent } from '../govuk-form-group-radio.component';
import { GOVUK_RADIOS } from '../govuk-form-group-radio.model';

@Component({
	selector: 'govuk-radio',
	templateUrl: './radio.component.html',
	styleUrls: ['./radio.component.scss'],
	imports: [FormsModule],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => RadioComponent),
			multi: true,
		},
	],
})
export class RadioComponent<T> {
	id = input<string>('');
	name = input<string>('');
	label = input<string>('');
	hint = input<string>('');
	value = input.required<T>();

	radios = inject<GovukFormGroupRadioComponent>(GOVUK_RADIOS, {
		optional: true,
	});
}
