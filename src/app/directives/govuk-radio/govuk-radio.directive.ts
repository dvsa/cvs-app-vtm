import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Directive({
	selector: '[govukRadio]',
})
export class GovukRadioDirective implements OnInit, OnDestroy {
	elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
	destroy$ = new ReplaySubject<boolean>(1);

	ngOnInit(): void {
		this.elementRef.nativeElement.classList.add('govuk-radios');
		const children = this.elementRef.nativeElement.children;
		console.log('test 0');
		console.log(children);
		console.log(this.elementRef.nativeElement.children);
		console.log(Array.from(this.elementRef.nativeElement.children));
		// if (children && children.length > 0) {
		//   console.log('test 1');
		//   for (let child of children) {
		//     console.log('test 2');
		//     child.classList.add('govuk-radios__item');
		//     const grandchildren = child.children;
		//     if (grandchildren.length  && grandchildren.length > 1) {
		//       console.log('test 3');
		//       grandchildren[0].classList.add('govuk-radios__input');
		//       grandchildren[1].classList.add('govuk-label');
		//       grandchildren[1].classList.add('govuk-radios__label');
		//     }
		//   }
		// }
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.complete();
	}
}
