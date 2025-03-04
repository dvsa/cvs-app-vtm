import { V3TechRecordModel } from '@/src/app/models/vehicle-tech-record.model';
import { Component, input } from '@angular/core';

@Component({
	selector: 'app-last-applicant-section',
	templateUrl: './last-applicant-section.component.html',
	styleUrls: ['./last-applicant-section.component.scss'],
})
export class LastApplicantSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<V3TechRecordModel>();
}

type Mode = 'view' | 'edit' | 'summary';
