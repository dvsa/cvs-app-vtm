import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Directive({ selector: '[tag]' })
export class TagDirective implements OnInit, OnDestroy {
	elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
	destroy$ = new ReplaySubject<boolean>(1);

	ngOnInit(): void {
		this.elementRef.nativeElement.classList.add('flex');
		this.elementRef.nativeElement.classList.add('flex-wrap');
		this.elementRef.nativeElement.classList.add('gap-2');
	}

	ngOnDestroy(): void {
		this.destroy$.next(true);
		this.destroy$.complete();
	}
}
