import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormNodeWidth } from '@services/dynamic-forms/dynamic-form.types';
import { ReplaySubject, takeUntil } from 'rxjs';

@Directive({ selector: '[govukInput]' })
export class GovukInputDirective implements OnInit, OnDestroy {
	elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
	controlContainer = inject(ControlContainer);

	controlName = input.required<string>({ alias: 'formControlName' });
	width = input<FormNodeWidth>();

	destroy$ = new ReplaySubject<boolean>(1);

	ngOnInit(): void {
		const controlName = this.controlName();
		const control = this.controlContainer.control?.get(controlName);
		if (control) {
			this.elementRef.nativeElement.setAttribute('id', controlName);
			this.elementRef.nativeElement.setAttribute('name', controlName);
			this.elementRef.nativeElement.setAttribute('aria-labelledby', `${controlName}-label`);
			if (this.width()) {
				this.elementRef.nativeElement.classList.add(`govuk-input--width-${this.width()}`);
			}
			this.elementRef.nativeElement.classList.add('govuk-input');

			control.statusChanges.pipe(takeUntil(this.destroy$)).subscribe((statusChange) => {
				if (statusChange === 'INVALID' && control.touched) {
					this.elementRef.nativeElement.classList.add('govuk-input--error');
					this.elementRef.nativeElement.setAttribute('aria-describedby', `${controlName}-error`);
				}

				if (statusChange === 'VALID') {
					this.elementRef.nativeElement.classList.remove('govuk-input--error');
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
