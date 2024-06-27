import { Component, Input } from '@angular/core';

@Component({
  selector: 'collapsible-text',
  templateUrl: './collapsible-text.component.html',
  styleUrls: ['./collapsible-text.component.scss'],
})
export class CollapsibleTextComponent {

  @Input() text: string = '';
  @Input() maxChars: number = 0;
  @Input() isCollapsed = true;

  open() {
    this.isCollapsed = false;
  }

  close() {
    this.isCollapsed = true;
  }
}
