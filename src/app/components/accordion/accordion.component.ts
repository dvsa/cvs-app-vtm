import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, model } from '@angular/core';
import { Store } from '@ngrx/store';
import { addSectionState, removeSectionState } from '@store/technical-records';

@Component({
	selector: 'app-accordion[id]',
	templateUrl: './accordion.component.html',
	styleUrls: ['./accordion.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgClass],
})
export class AccordionComponent {
	cdr = inject(ChangeDetectorRef);
	store = inject(Store);

	readonly title = input<string | undefined>('');
	readonly id = input<string | number>('');

	isExpanded = model<boolean | null | undefined>(false);

	get iconStyle(): string {
		return `govuk-accordion-nav__chevron${this.isExpanded() ? '' : ' govuk-accordion-nav__chevron--down'}`;
	}

	open(sectionName: string | number | undefined): void {
		this.isExpanded.set(true);
		this.cdr.markForCheck();
		if (sectionName) this.store.dispatch(addSectionState({ section: sectionName }));
	}

	close(sectionName: string | number | undefined): void {
		this.isExpanded.set(false);
		this.cdr.markForCheck();
		if (sectionName) this.store.dispatch(removeSectionState({ section: sectionName }));
	}
}
