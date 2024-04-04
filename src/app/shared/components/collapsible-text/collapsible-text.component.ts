import { ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'collapsible-text',
  templateUrl: './collapsible-text.component.html',
  styleUrls: ['./collapsible-text.component.scss'],
})
export class CollapsibleTextComponent {

  @Input() text: string = '';
  @Input() maxChars: number = 0;
  @Input() isCollapsed = true;

  constructor(private cdr: ChangeDetectorRef) {}

  getCollapsedString() {
    if (this.text.length <= this.maxChars) {
      return this.text;
    }
    return this.text.slice(0, this.maxChars);
  }

  open() {
    console.log('test');
    this.isCollapsed = false;
    this.cdr.markForCheck();
    console.log(this.isCollapsed);
  }

  close() {
    this.isCollapsed = true;
    this.cdr.markForCheck();
  }
}
