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
  @ContentChildren(AccordionComponent, { descendants: true }) set accordions(value: QueryList<AccordionComponent> | undefined) {
    console.log(value ? value.length : 'no accordions found');
    this._accordions = value;
    this.toggleAccordions();
  }

  @Input() isExpanded = false;
  @Input() layout?: string;

  constructor(private cdr: ChangeDetectorRef) {}

  get iconStyle(): string {
    return 'govuk-accordion-nav__chevron' + (this.isExpanded ? '' : ' govuk-accordion-nav__chevron--down');
  }

  toggle(): void {
    this.isExpanded = !this.isExpanded;
    this.toggleAccordions();
    this.cdr.markForCheck();
  }

  toggleAccordions(): void {
    if (this.accordions) {
      this.accordions.forEach(a => (this.isExpanded ? a.open() : a.close()));
    }
  }
}
