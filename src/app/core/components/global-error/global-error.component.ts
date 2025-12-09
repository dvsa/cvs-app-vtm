import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { addSectionStateFromGlobalError } from '@store/technical-records';
import { GlobalError } from './global-error.interface';
import { GlobalErrorService } from './global-error.service';

@Component({
	selector: 'app-global-error',
	templateUrl: './global-error.component.html',
	imports: [AsyncPipe],
})
export class GlobalErrorComponent {
	globalErrorService = inject(GlobalErrorService);
	store = inject(Store);
	cdr = inject(ChangeDetectorRef);

	goto(error: GlobalError) {
		console.log(error);
		if (error.anchorLink) {
			let focusCount = 0;

			if (error.accordion) {
				console.log('accordion:', error.accordion);
				this.cdr.markForCheck();

				this.store.dispatch(addSectionStateFromGlobalError({ section: error.accordion }));
			}

			document
				.querySelectorAll(`
          #${error.anchorLink},
          #${error.anchorLink} a[href]:not([tabindex='-1']),
          #${error.anchorLink} area[href]:not([tabindex='-1']),
          #${error.anchorLink} input:not([disabled]):not([tabindex='-1']),
          #${error.anchorLink} select:not([disabled]):not([tabindex='-1']),
          #${error.anchorLink} textarea:not([disabled]):not([tabindex='-1']),
          #${error.anchorLink} button:not([disabled]):not([tabindex='-1']),
          #${error.anchorLink} iframe:not([tabindex='-1']),
          #${error.anchorLink} [tabindex]:not([tabindex='-1']),
          #${error.anchorLink} [contentEditable=true]:not([tabindex='-1'])
      `)
				.forEach((el) => {
					if (el instanceof HTMLElement && focusCount < 2) {
						focusCount++;
						el.focus({ preventScroll: false });
					}
				});
		}
	}
}
