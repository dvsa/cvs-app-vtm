import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appFocusNext]'
})
export class FocusNextDirective {
  @Input() includeTime = false;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(e: InputEvent) {
    const {
      nativeElement: { id, value }
    } = this.el;
    const segments = id.split('-');
    const currentSegment = segments.splice(-1)[0];
    const name = segments.join('-');

    if (value.length === 2) {
      if ('day' === currentSegment) {
        this.focus(`${name}-month`);
        return;
      } else if ('month' === currentSegment) {
        this.focus(`${name}-year`);
        return;
      } else if ('hour' === currentSegment) {
        this.focus(`${name}-minute`);
        return;
      }
    } else if (value.length === 4 && this.includeTime && 'year' === currentSegment) {
      this.focus(`${name}-hour`);
      return;
    }
  }

  focus(el: string) {
    document.getElementById(el)?.focus();
  }
}
