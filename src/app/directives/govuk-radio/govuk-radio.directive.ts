import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { ReplaySubject, takeUntil } from 'rxjs';

@Directive({
	selector: '[govukRadio]',
})
export class GovukRadioDirective implements OnInit, OnDestroy {
	elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
	controlContainer = inject(ControlContainer);

	controlName = input.required<string>({ alias: 'formControlName' });

	destroy$ = new ReplaySubject<boolean>(1);

	ngOnInit(): void {
		this.elementRef.nativeElement.classList.add('govuk-radios__input');

		const controlName = this.controlName();
		const control = this.controlContainer.control?.get(controlName);
		if (control) {
			this.elementRef.nativeElement.setAttribute('aria-labelledby', `${controlName}-label`);
			control.statusChanges.pipe(takeUntil(this.destroy$)).subscribe((statusChange) => {
				if (statusChange === 'INVALID' && control.touched) {
					this.elementRef.nativeElement.classList.add('govuk-radio--error');
					this.elementRef.nativeElement.setAttribute('aria-describedby', `${controlName}-error`);
				}

				if (statusChange === 'VALID') {
					this.elementRef.nativeElement.classList.remove('govuk-radio--error');
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
