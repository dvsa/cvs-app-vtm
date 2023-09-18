import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appFocusNextApprovalType]'
})
export class ApprovalTypeFocusNextDirective {
  @Input('appFocusNextApprovalType') nextInputId: string = '';
  @Input() characterLimit: number = 0;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput() {
    const { value } = this.el.nativeElement;
    console.log(value);
    console.log(this.nextInputId);
    console.log(this.characterLimit);
    if (value.length >= this.characterLimit) {
      const nextInput = document.getElementById(this.nextInputId);
      if (nextInput) {
        nextInput.focus();
      }
    }
  }
}
