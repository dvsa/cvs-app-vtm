import { Component, input } from '@angular/core';

@Component({
	selector: 'app-field-error-message',
	templateUrl: './field-error-message.component.html',
	imports: [],
})
export class FieldErrorMessageComponent {
	readonly name = input('');
	readonly error = input<string | null>();
}
