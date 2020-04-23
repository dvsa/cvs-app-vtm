import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[appDigitOnly]'
})
export class DigitOnlyDirective {

  constructor() { }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (e.key === ' ' || isNaN(Number(e.key))) {
      e.preventDefault();
    }
  }

}
