import { Component, input } from '@angular/core';

@Component({
	selector: 'app-input-spinner',
	templateUrl: './input-spinner.component.html',
	styleUrls: ['./input-spinner.component.scss'],
	imports: [],
})
export class InputSpinnerComponent {
	readonly isValid = input('');
}
