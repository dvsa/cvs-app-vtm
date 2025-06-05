import { Directive, HostListener, OnDestroy, input, output } from '@angular/core';
import { Subject, throttleTime } from 'rxjs';

@Directive({ selector: '[appPreventDoubleClick]' })
export class PreventDoubleClickDirective implements OnDestroy {
	readonly throttleTime = input(1000);

	readonly clicked = output<PointerEvent>();

	private clicks = new Subject<PointerEvent>();
	private subscription = this.clicks
		.pipe(throttleTime(this.throttleTime()))
		.subscribe((e: PointerEvent) => this.emitThrottledClick(e));

	emitThrottledClick(e: PointerEvent) {
		this.clicked.emit(e);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	@HostListener('click', ['$event'])
	clickEvent(event: PointerEvent) {
		event.preventDefault();
		event.stopPropagation();
		this.clicks.next(event);
	}
}
