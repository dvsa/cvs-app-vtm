import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Input, QueryList } from '@angular/core';
import { AccordionComponent } from '../accordion/accordion.component';

@Component({
  selector: 'app-accordion-control',
  templateUrl: './accordion-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionControlComponent implements AfterContentInit {
  @ContentChildren(AccordionComponent) _accordions?: QueryList<AccordionComponent>;

  @Input() set expanded(expanded: boolean) {
    this.expanded_ = expanded;
  }

  private accordions_: Array<AccordionComponent> = [];
  private expanded_ = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    this._accordions?.forEach(a => this.accordions_.push(a));
  }

  get accordions() {
    return this.accordions_;
  }

  get expanded(): boolean {
    return this.expanded_;
  }

  open(): void {
    this.expanded = true;
    this.accordions_.forEach(a => {
      a.open();
    });
    this.cdr.markForCheck();
  }
  close(): void {
    this.expanded = false;
    this.accordions_.forEach(a => a.close());
    this.cdr.markForCheck();
  }
}
