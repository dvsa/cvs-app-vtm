import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoSpace]'
})
export class NoSpaceDirective {
  constructor() {}

  @HostListener('keydown', ['$event'])
  public onKeyDown(e: KeyboardEvent): void {
    if (e.key === ' ' || e.key === 'Space') {
      console.log('preventing default');
      e.preventDefault();
    }
  }
}
