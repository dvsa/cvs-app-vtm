import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Input, QueryList } from '@angular/core';
import { AccordionComponent } from '../accordion/accordion.component';

@Component({
  selector: 'app-accordion-control',
  templateUrl: './accordion-control.component.html',
  styleUrls: ['accordion-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionControlComponent {
  private _accordions?: QueryList<AccordionComponent>;
  get accordions(): QueryList<AccordionComponent> | undefined {
    return this._accordions;
  }
  @ContentChildren(AccordionComponent, { descendants: true, emitDistinctChangesOnly: false }) set accordions(
    value: QueryList<AccordionComponent> | undefined
  ) {
    this._accordions = value;
    this.expandAccordians();
  }

  @Input() isExpanded = false;
  @Input() layout?: string;
  @Input() class: string = '';
  @Input() sectionState: (string | number)[] | undefined = [];

  constructor(private cdr: ChangeDetectorRef) {}

  get iconStyle(): string {
    return 'govuk-accordion-nav__chevron' + (this.isExpanded ? '' : ' govuk-accordion-nav__chevron--down');
  }

  toggle(): void {
    this.isExpanded = !this.isExpanded;
    this.toggleAccordions();
    this.cdr.markForCheck();
  }

  private expandAccordians(): void {
    if (this.accordions && this.sectionState && this.sectionState.length > 0) {
      this.accordions?.forEach(a => (this.sectionState?.includes(a.id) ? a.open(a.id) : a.close(a.id)));
    }
  }

  private toggleAccordions(): void {
    if (this.accordions) {
      this.accordions.forEach(a => (this.isExpanded ? a.open(a.id) : a.close(a.id)));
    }
  }
}
