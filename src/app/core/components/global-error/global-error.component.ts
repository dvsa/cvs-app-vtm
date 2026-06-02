import { AsyncPipe } from '@angular/common';
import { ChangeDetectorRef, Component, DOCUMENT, ElementRef, effect, inject, viewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
	document = inject(DOCUMENT);
	titleService = inject(Title);

	links = viewChildren<ElementRef<HTMLAnchorElement>>('link');

	constructor() {
		effect(() => {
			const links = this.links();
			const title = this.titleService.getTitle();

			// Remove 'Error: ' from title if there are no links
			if (links.length === 0 && title.startsWith('Error: ')) {
				this.titleService.setTitle(title.replace('Error: ', ''));
			}

			// Add 'Error: ' to title if there are links
			if (links.length > 0 && !title.startsWith('Error: ')) {
				this.titleService.setTitle(`Error: ${title}`);
			}

			// Bring first link into focus, scrolling it into view if needed
			links[0]?.nativeElement?.focus({ preventScroll: false });
		});
	}

	goto(event: MouseEvent, error: GlobalError) {
		event.preventDefault();

		if (error.anchorLink) {
			if (error.accordion) {
				this.cdr.markForCheck();
				this.store.dispatch(addSectionStateFromGlobalError({ section: error.accordion }));
			}

			setTimeout(() => {
				let focusCount = 0;

				this.document
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
			}, 100);
		}
	}
}
