import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName][appNoWhitespace]'
})
export class NoWhitespaceDirective {
  constructor(private control: NgControl) {}

  @HostListener('focusout', ['$event.target'])
  public onInput(input: HTMLInputElement): void {
    console.log("It's blurred");
    this.control.control?.setValue(input.value.replace(/\s/g, ''));
  }
}
