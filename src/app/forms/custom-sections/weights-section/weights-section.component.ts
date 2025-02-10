import { Component, input } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';

@Component({
	selector: 'app-weights-section',
	templateUrl: './weights-section.component.html',
	styleUrls: ['./weights-section.component.scss'],
})
export class WeightsSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<TechRecordType<'hgv' | 'trl' | 'psv'>>();
}

type Mode = 'view' | 'edit' | 'summary';
