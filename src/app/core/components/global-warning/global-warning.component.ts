import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlobalWarning } from './global-warning.interface';
import { GlobalWarningService } from './global-warning.service';

@Component({
	selector: 'app-global-warning',
	templateUrl: './global-warning.component.html',
	imports: [RouterLink, AsyncPipe],
})
export class GlobalWarningComponent {
	globalWarningService = inject(GlobalWarningService);

	goto(warning: GlobalWarning) {
		if (warning.anchorLink) {
			const el = document.getElementById(warning.anchorLink);
			el?.focus({ preventScroll: false });
		}
	}
}
