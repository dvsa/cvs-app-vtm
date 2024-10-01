import { Component, Input, inject } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Component({
	selector: 'app-control-errors',
	templateUrl: './control-errors.component.html',
})
export class ControlErrorsComponent {
	controlContainer = inject(ControlContainer);

	@Input({ required: true })
	for!: string;
}
