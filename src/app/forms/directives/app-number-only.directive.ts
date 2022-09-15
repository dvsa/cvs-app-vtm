import { keyframes } from '@angular/animations';
import { Directive, ElementRef, HostListener, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]'
})
export class NumberOnlyDirective {
  inputElement: HTMLInputElement;

  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    const number = new RegExp(/^\d*$/);
    if (!number.test(e.key.toString())) {
      e.preventDefault();
    }
  }
}
