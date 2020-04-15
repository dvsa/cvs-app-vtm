import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[vtmNullValue]'
})
export class NullValueDirective {
  constructor(private control: NgControl) {}

  @HostListener('keyup', ['$event.target'])
  @HostListener('change', ['$event.target'])
  onEvent(target: HTMLInputElement) {
    if (target.value === '') {
      this.control.control.patchValue(null);
    }
  }
}
