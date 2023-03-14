import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNoWhitespace]'
})
export class NoWhitespaceDirective {
  @HostListener('focusout', ['$event.target'])
  public onBlur(input: HTMLInputElement): void {
    input.value = input.value.replace(/\s/g, '');
    input.dispatchEvent(new Event('input'));
  }
}
