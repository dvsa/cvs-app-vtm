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
    console.log('Content children is doing... something...');
  }

  @Input() isExpanded = false;
  @Input() layout?: string;
  @Input() class: string = '';

  constructor(private cdr: ChangeDetectorRef) {}

  get iconStyle(): string {
    return 'govuk-accordion-nav__chevron' + (this.isExpanded ? '' : ' govuk-accordion-nav__chevron--down');
  }

  toggle(): void {
    this.isExpanded = !this.isExpanded;
    this.toggleAccordions();
    this.cdr.markForCheck();
  }

  private toggleAccordions(): void {
    console.log('Toggle accordions');
    if (this.accordions) {
      this.accordions.forEach(a => (this.isExpanded ? a.open() : a.close()));
    }
  }
}
