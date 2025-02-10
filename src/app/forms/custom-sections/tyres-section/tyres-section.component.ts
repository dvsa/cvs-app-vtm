import { Component, input } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';

@Component({
	selector: 'app-tyres-section',
	templateUrl: './tyres-section.component.html',
	styleUrls: ['./tyres-section.component.scss'],
})
export class TyresSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<TechRecordType<'hgv' | 'psv' | 'trl'>>();
}

type Mode = 'view' | 'edit' | 'summary';
