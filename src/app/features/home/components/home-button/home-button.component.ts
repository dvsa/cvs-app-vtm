import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-home-button',
	templateUrl: './home-button.component.html',
	styleUrls: ['./home-button.component.scss'],
	imports: [RouterLink],
})
export class HomeButtonComponent {
	readonly url = input('');
	readonly linkText = input('');
	readonly description = input('');
	readonly linkId = input('');
}
