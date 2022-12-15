import { Directive, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { Subject, Subscription, throttleTime } from 'rxjs';

@Directive({
  selector: '[appPreventDoubleClick]'
})
export class PreventDoubleClickDirective implements OnDestroy {
  @Input()
  throttleTime = 1000;

  @Output()
  clicked = new EventEmitter<PointerEvent>();

  private clicks = new Subject<PointerEvent>();
  private subscription: Subscription;

  constructor() {
    this.subscription = this.clicks.pipe(throttleTime(this.throttleTime)).subscribe((e: PointerEvent) => this.emitThrottledClick(e));
  }

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
