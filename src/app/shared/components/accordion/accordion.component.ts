import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  selector: 'app-accordion[id]',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionComponent {
  @Input() title: string | undefined = '';
  @Input() id: string | number = '';

  @Input() set expanded(expanded: boolean) {
    this.expanded_ = expanded;
  }

  private expanded_ = false;

  constructor(private cdr: ChangeDetectorRef) {}

  get expanded(): boolean {
    return this.expanded_;
  }

  toggle() {
    this.expanded = !this.expanded;
  }

  open(): void {
    this.expanded = true;
    this.cdr.markForCheck();
  }
  close(): void {
    this.expanded = false;
    this.cdr.markForCheck();
  }
}
