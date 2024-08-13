import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-field-error-message',
	templateUrl: './field-error-message.component.html',
})
export class FieldErrorMessageComponent {
	@Input() name = '';
	@Input() error?: string | null;
}
