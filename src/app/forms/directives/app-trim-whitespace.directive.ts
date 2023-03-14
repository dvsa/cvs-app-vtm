import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appTrimWhitespace]'
})
export class TrimWhitespaceDirective {
  @HostListener('focusout', ['$event.target'])
  public onBlur(input: HTMLInputElement): void {
    input.value = input.value.trim();
    input.dispatchEvent(new Event('input'));
  }
}
