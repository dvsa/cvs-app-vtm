import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, Input,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'collapsible-text',
  templateUrl: './collapsible-text.component.html',
  styleUrls: ['./collapsible-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CollapsibleTextComponent,
      multi: true,
    },
  ],
})
export class CollapsibleTextComponent {

  @Input() text: string = '';
  @Input() maxChars: number = 0;
  @Input() isCollapsed = true;

  constructor(private cdr: ChangeDetectorRef) {
  }

  getCollapsedString() {
    if (this.text.length <= this.maxChars) {
      return this.text;
    }
    return this.text.slice(0, this.maxChars);
  }

  open() {
    this.isCollapsed = false;
    this.cdr.markForCheck();
  }

  close() {
    this.isCollapsed = true;
    this.cdr.markForCheck();
  }
}
