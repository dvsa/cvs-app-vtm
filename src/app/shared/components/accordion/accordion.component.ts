import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, Input,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addSectionState, removeSectionState,
} from '@store/technical-records';

@Component({
  selector: 'app-accordion[id]',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent {
  @Input() title: string | undefined = '';
  @Input() id: string | number = '';

  @Input() isExpanded: boolean | null | undefined = false;

  constructor(private cdr: ChangeDetectorRef, private store: Store) {}

  get iconStyle(): string {
    return `govuk-accordion-nav__chevron${(this.isExpanded ? '' : ' govuk-accordion-nav__chevron--down')}`;
  }

  open(sectionName: string | number | undefined): void {
    this.isExpanded = true;
    this.cdr.markForCheck();
    if (sectionName) this.store.dispatch(addSectionState({ section: sectionName }));
  }

  close(sectionName: string | number | undefined): void {
    this.isExpanded = false;
    this.cdr.markForCheck();
    if (sectionName) this.store.dispatch(removeSectionState({ section: sectionName }));
  }
}
