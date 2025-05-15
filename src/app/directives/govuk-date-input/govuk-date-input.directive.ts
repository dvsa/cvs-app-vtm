import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { NumberOnlyDirective } from '@directives/app-number-only/app-number-only.directive';
import { DateFocusNextDirective } from '@directives/date-focus-next/date-focus-next.directive';
import { ReplaySubject, takeUntil } from 'rxjs';

@Directive({
	selector: '[govukDateInput]',
	standalone: true,
	hostDirectives: [DateFocusNextDirective, NumberOnlyDirective],
})
export class GovukDateInputDirective implements OnInit, OnDestroy {
	elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
	controlContainer = inject(ControlContainer);

	govukDateInput = input.required<string>();
	controlName = input.required<string>({ alias: 'formControlName' });

	destroy$ = new ReplaySubject<boolean>(1);

	ngOnInit(): void {
		const parent = this.govukDateInput();
		const controlName = this.controlName();
		const id = `${parent}-${controlName}`;

		const control = this.controlContainer.control?.get(controlName);
		if (control) {
			this.elementRef.nativeElement.setAttribute('id', id);
			this.elementRef.nativeElement.setAttribute('name', id);
			this.elementRef.nativeElement.setAttribute('type', 'number');
			this.elementRef.nativeElement.setAttribute('inputmode', 'numeric');
			this.elementRef.nativeElement.classList.add('govuk-input', 'govuk-date-input__input');

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
