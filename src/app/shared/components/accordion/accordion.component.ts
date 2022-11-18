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

  @Input() isExpanded = false;

  constructor(private cdr: ChangeDetectorRef) {}

  get iconStyle(): string {
    return 'govuk-accordion-nav__chevron' + (this.isExpanded ? '' : ' govuk-accordion-nav__chevron--down');
  }

  open(): void {
    this.isExpanded = true;
    this.cdr.markForCheck();
  }

  close(): void {
    this.isExpanded = false;
    this.cdr.markForCheck();
  }
}
