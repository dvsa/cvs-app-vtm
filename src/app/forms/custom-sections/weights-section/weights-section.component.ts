import { Component, input } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';

import { WeightsSectionEditComponent } from './weights-section-edit/weights-section-edit.component';
import { WeightsSectionSummaryComponent } from './weights-section-summary/weights-section-summary.component';
import { WeightsSectionViewComponent } from './weights-section-view/weights-section-view.component';

@Component({
	selector: 'app-weights-section',
	templateUrl: './weights-section.component.html',
	styleUrls: ['./weights-section.component.scss'],
	imports: [WeightsSectionViewComponent, WeightsSectionEditComponent, WeightsSectionSummaryComponent],
})
export class WeightsSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<TechRecordType<'hgv' | 'trl' | 'psv'>>();
}

type Mode = 'view' | 'edit' | 'summary';
