import {
  Directive, ElementRef, Input, OnInit,
} from '@angular/core';

@Directive({
  selector: '[appNestingLevel]',
})
export class NestingLevelDirective implements OnInit {
  @Input() appNestingLevel = 0;

  constructor(public readonly elementRef: ElementRef<HTMLElement>) {
  }

  ngOnInit(): void {
    const ml = this.appNestingLevel > 1 ? (2 * (this.appNestingLevel - 1)) : 0;
    const pl = this.appNestingLevel > 0 ? 2 : 0;
    const mb = this.appNestingLevel > 0 ? 1 : 0;
    const pt = this.appNestingLevel > 0 ? 1 : 0;
    const bw = this.appNestingLevel > 0 ? 0.4 : 0;

    this.elementRef.nativeElement.style.marginLeft = `${ml}rem`;
    this.elementRef.nativeElement.style.marginBottom = `${mb}rem`;
    this.elementRef.nativeElement.style.paddingTop = `${pt}rem`;
    this.elementRef.nativeElement.style.paddingLeft = `${pl}rem`;
    this.elementRef.nativeElement.style.borderLeftColor = '#bec0c2';
    this.elementRef.nativeElement.style.borderLeftStyle = 'solid';
    this.elementRef.nativeElement.style.borderLeftWidth = `${bw}rem`;
  }
}
