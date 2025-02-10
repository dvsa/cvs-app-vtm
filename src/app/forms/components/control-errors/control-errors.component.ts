import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-control-errors',
	templateUrl: './control-errors.component.html',
})
export class ControlErrorsComponent {
	@Input({ required: true })
	elementId!: string;

	@Input({ required: true })
	control!: FormControl;
}
