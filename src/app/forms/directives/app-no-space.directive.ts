import { HttpEvent } from '@angular/common/http';
import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNoSpace]'
})
export class NoSpaceDirective {
  constructor() {}

  @HostListener('keydown', ['$event'])
  public onKeyDown(e: KeyboardEvent): void {
    if (e.key === ' ' || e.key === 'Space') {
      e.preventDefault();
    }
  }
}
