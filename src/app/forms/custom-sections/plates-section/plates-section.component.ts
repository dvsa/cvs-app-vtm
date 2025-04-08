import { Component, input } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';

import { PlatesSectionEditComponent } from './plates-section-edit/plates-section-edit.component';
import { PlatesSectionViewComponent } from './plates-section-view/plates-section-view.component';

@Component({
	selector: 'app-plates-section',
	templateUrl: './plates-section.component.html',
	styleUrls: ['./plates-section.component.scss'],
	imports: [PlatesSectionViewComponent, PlatesSectionEditComponent],
})
export class PlatesSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<TechRecordType<'hgv' | 'trl'>>();
}

type Mode = 'view' | 'edit' | 'summary';
