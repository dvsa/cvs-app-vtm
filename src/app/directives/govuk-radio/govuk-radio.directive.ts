import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { ReplaySubject, takeUntil } from 'rxjs';

@Directive({
	selector: '[govukRadio]',
})
export class GovukRadioDirective implements OnInit, OnDestroy {
	elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
	controlContainer = inject(ControlContainer);

	formControlName = input.required<string>();
	width = input<FormNodeWidth>();

	destroy$ = new ReplaySubject<boolean>(1);

	ngOnInit(): void {
		this.elementRef.nativeElement.setAttribute('type', 'radio');
		this.elementRef.nativeElement.classList.add('govuk-radios__input');

		const formControlName = this.formControlName();
		const control = this.controlContainer.control?.get(formControlName);
		if (control) {
			control.statusChanges.pipe(takeUntil(this.destroy$)).subscribe((statusChange) => {
				if (statusChange === 'INVALID' && control.touched) {
					this.elementRef.nativeElement.classList.add('govuk-radio--error');
					this.elementRef.nativeElement.setAttribute('aria-describedby', `${formControlName}-error`);
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
