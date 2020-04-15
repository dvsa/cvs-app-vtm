import { Directive, HostListener, Input } from '@angular/core';
import { Location } from '@angular/common';

@Directive({
  selector: '[vtmBackButton]'
})
export class BackButtonDirective {
  constructor(private location: Location) {}

  @HostListener('click')
  onClick() {
    this.location.back();
  }
}
