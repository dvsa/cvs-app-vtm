import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName][appToUppercase]'
})
export class ToUppercaseDirective {
  constructor(private control: NgControl) {}

  @HostListener('input', ['$event.target'])
  public onInput(input: HTMLInputElement): void {
    this.control.control?.setValue(input.value.toUpperCase());
  }
}
