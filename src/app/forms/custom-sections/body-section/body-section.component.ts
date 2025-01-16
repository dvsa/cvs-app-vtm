import { V3TechRecordModel } from '@/src/app/models/vehicle-tech-record.model';
import { Component, input } from '@angular/core';

@Component({
	selector: 'app-body-section',
	templateUrl: './body-section.component.html',
	styleUrls: ['./body-section.component.scss'],
})
export class BodySectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<V3TechRecordModel>();
}

type Mode = 'view' | 'edit' | 'summary';
