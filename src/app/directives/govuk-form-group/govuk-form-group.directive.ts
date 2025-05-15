import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Directive({ selector: '[govukFormGroup]' })
export class GovukFormGroupDirective implements OnInit, OnDestroy {
	elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
	destroy$ = new ReplaySubject<boolean>(1);

	ngOnInit(): void {
		this.elementRef.nativeElement.classList.add('govuk-form-group');
		const children = this.elementRef.nativeElement.children;
		if (children && children[0].tagName === 'H1') {
			const child = children[0];
			child.classList.add('govuk-label-wrapper');
			const grandchildren = child.children;
			if (grandchildren && grandchildren[0].tagName === 'LABEL') {
				grandchildren[0].classList.add('govuk-label');
				grandchildren[0].classList.add('govuk-label--m');
			}
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.complete();
	}
}
