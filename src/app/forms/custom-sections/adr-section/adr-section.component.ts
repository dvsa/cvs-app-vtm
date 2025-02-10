import { Component, input } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';

@Component({
	selector: 'app-adr-section',
	templateUrl: './adr-section.component.html',
	styleUrls: ['./adr-section.component.scss'],
})
export class AdrSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<TechRecordType<'hgv' | 'lgv' | 'trl'>>();
}

type Mode = 'view' | 'edit' | 'summary';
