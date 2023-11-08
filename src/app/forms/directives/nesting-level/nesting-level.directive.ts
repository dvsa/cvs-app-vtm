import {
  Directive, ElementRef, Input, OnInit,
} from '@angular/core';

@Directive({
  selector: '[appNestingLevel]',
})
export class NestingLevelDirective implements OnInit {
  @Input() nestingLevel = 0;

  constructor(public readonly elementRef: ElementRef<HTMLElement>) {
  }

  ngOnInit(): void {
    const ml = this.nestingLevel > 1 ? (2 * (this.nestingLevel - 1)) : 0;
    const pl = this.nestingLevel > 0 ? 2 : 0;
    const mb = this.nestingLevel > 0 ? 1 : 0;
    const pt = this.nestingLevel > 0 ? 1 : 0;
    const bw = this.nestingLevel > 0 ? 0.4 : 0;

    this.elementRef.nativeElement.style.marginLeft = `${ml}rem`;
    this.elementRef.nativeElement.style.marginBottom = `${mb}rem`;
    this.elementRef.nativeElement.style.paddingTop = `${pt}rem`;
    this.elementRef.nativeElement.style.paddingLeft = `${pl}rem`;
    this.elementRef.nativeElement.style.borderLeftColor = '#bec0c2';
    this.elementRef.nativeElement.style.borderLeftStyle = 'solid';
    this.elementRef.nativeElement.style.borderLeftWidth = `${bw}rem`;
  }
}
