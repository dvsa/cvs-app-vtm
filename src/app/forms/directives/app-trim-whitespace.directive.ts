import { Directive, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';

@Directive({
  selector: '[appTrimWhitespace]'
})
export class TrimWhitespaceDirective {
  @HostListener('focusout', ['$event.target'])
  public onBlur(input: HTMLInputElement): void {
    input.value = input.value.trim();
    input.dispatchEvent(new Event('input'));
  }

  @HostListener('input', ['$event.target'])
  public onInput(input: HTMLInputElement): void {
    input.value = input.value.trim();
  }
}
