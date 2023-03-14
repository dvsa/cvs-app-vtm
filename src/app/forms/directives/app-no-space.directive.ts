import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoSpace]'
})
export class NoSpaceDirective {
  @HostListener('keydown', ['$event'])
  public onKeyDown(e: KeyboardEvent): void {
    if (e.key === ' ' || e.key === 'Space') {
      console.log('preventing default');
      e.preventDefault();
    }
  }

  @HostListener('focusout', ['$event.target'])
  public onBlur(input: HTMLInputElement): void {
    input.value = input.value.replace(/\s/g, '');
    input.dispatchEvent(new Event('input'));
  }
}
