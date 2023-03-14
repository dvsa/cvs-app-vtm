import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTrimWhitespace]'
})
export class TrimWhitespaceDirective {
  @HostListener('focusout', ['$event.target'])
  public onBlur(input: HTMLInputElement): void {
    input.value = input.value.replace(/\s/g, '');
    input.dispatchEvent(new Event('input'));
  }
}
