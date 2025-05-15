import { Component, input } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';

import { AdrSectionEditComponent } from './adr-section-edit/adr-section-edit.component';
import { AdrSectionSummaryComponent } from './adr-section-summary/adr-section-summary.component';
import { AdrSectionViewComponent } from './adr-section-view/adr-section-view.component';

@Component({
	selector: 'app-adr-section',
	templateUrl: './adr-section.component.html',
	styleUrls: ['./adr-section.component.scss'],
	imports: [AdrSectionViewComponent, AdrSectionEditComponent, AdrSectionSummaryComponent],
})
export class AdrSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<TechRecordType<'hgv' | 'lgv' | 'trl'>>();
}

type Mode = 'view' | 'edit' | 'summary';
