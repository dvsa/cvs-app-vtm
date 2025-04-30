import { KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-control-errors',
	templateUrl: './control-errors.component.html',
	imports: [KeyValuePipe],
})
export class ControlErrorsComponent {
	readonly elementId = input.required<string>();

	readonly control = input.required<FormControl>();
}
