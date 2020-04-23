import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[vtmDigitOnly]'
})
export class DigitOnlyDirective {
  constructor() {}

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    console.log(e.key);
    if (e.key === ' ' || isNaN(Number(e.key))) {
      e.preventDefault();
    }
  }

}
