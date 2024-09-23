import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { ReplaySubject, takeUntil } from 'rxjs';

@Directive({
	selector: '[govukTextarea]',
})
export class GovukTextareaDirective implements OnInit, OnDestroy {
	elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
	controlContainer = inject(ControlContainer);

	formControlName = input.required<string>();

	destroy$ = new ReplaySubject<boolean>(1);

	ngOnInit(): void {
		const formControlName = this.formControlName();
		const control = this.controlContainer.control?.get(formControlName);
		if (control) {
			this.elementRef.nativeElement.setAttribute('rows', '5');
			this.elementRef.nativeElement.setAttribute('id', formControlName);
			this.elementRef.nativeElement.setAttribute('name', formControlName);
			this.elementRef.nativeElement.classList.add('govuk-textarea');
			this.elementRef.nativeElement.classList.add('govuk-js-character-count');

			control.statusChanges.pipe(takeUntil(this.destroy$)).subscribe((statusChange) => {
				if (statusChange === 'INVALID' && control.touched) {
					this.elementRef.nativeElement.classList.add('govuk-textarea-error');
					this.elementRef.nativeElement.setAttribute('aria-describedby', `${formControlName}-error`);
				}

				if (statusChange === 'VALID') {
					this.elementRef.nativeElement.classList.remove('govuk-textarea-error');
					this.elementRef.nativeElement.setAttribute('aria-describedby', '');
				}
			});
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.complete();
	}
}
