import { NgClass } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ContentChildren,
	QueryList,
	inject,
	input,
	model,
} from '@angular/core';
import { AccordionComponent } from '../accordion/accordion.component';

@Component({
	selector: 'app-accordion-control',
	templateUrl: './accordion-control.component.html',
	styleUrls: ['accordion-control.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [NgClass],
})
export class AccordionControlComponent {
	cdr = inject(ChangeDetectorRef);

	private accordionsList?: QueryList<AccordionComponent>;
	get accordions(): QueryList<AccordionComponent> | undefined {
		return this.accordionsList;
	}
	// TODO: Skipped for migration because:
	//  Accessor queries cannot be migrated as they are too complex.
	@ContentChildren(AccordionComponent, {
		descendants: true,
		emitDistinctChangesOnly: false,
	})
	set accordions(value: QueryList<AccordionComponent> | undefined) {
		this.accordionsList = value;
		if (this.accordionsList?.length === this.sectionState()?.length) {
			this.isExpanded.set(true);
		}
		if (this.isExpanded()) {
			this.toggleAccordions();
		}
		this.expandAccordions();
	}

	isExpanded = model(false);
	readonly layout = input<string>();
	readonly class = input('');
	readonly sectionState = input<(string | number)[] | undefined | null>([]);

	get iconStyle(): string {
		return `govuk-accordion-nav__chevron${this.isExpanded() ? '' : ' govuk-accordion-nav__chevron--down'}`;
	}

	toggle(): void {
		this.isExpanded.set(!this.isExpanded());
		this.toggleAccordions();
		this.cdr.markForCheck();
	}

	private expandAccordions(): void {
		const sectionState = this.sectionState();
		if (this.accordions && sectionState && sectionState.length > 0) {
			this.accordions?.forEach((a) => {
				const id = a.id();
				return this.sectionState()?.includes(id) ? a.open(id) : a.close(id);
			});
		}
	}

	private toggleAccordions(): void {
		if (this.accordions) {
			this.accordions.forEach((a) => (this.isExpanded() ? a.open(a.id()) : a.close(a.id())));
		}
	}
}
