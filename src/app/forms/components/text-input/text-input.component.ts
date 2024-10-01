import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlComponent } from '../base-control/base-control.component';

@Component({
	selector: 'app-text-input',
	templateUrl: './text-input.component.html',
	styleUrls: ['./text-input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: TextInputComponent,
			multi: true,
		},
	],
})
export class TextInputComponent extends BaseControlComponent {
	@Input() numeric = false;
	@Output() blur = new EventEmitter<FocusEvent>();

	get style(): string {
		return `govuk-input ${this.width ? `govuk-input--width-${this.width}` : ''}`;
	}

	handleChange(event: unknown) {
		if (typeof event === 'string') {
			this.value = this.formatString(event);
		}
		this.onChange(this.value);
	}
}
