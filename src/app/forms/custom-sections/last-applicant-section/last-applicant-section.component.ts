import { Component, input } from '@angular/core';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { LastApplicantSectionEditComponent } from './last-applicant-section-edit/last-applicant-section-edit.component';
import { LastApplicantSectionSummaryComponent } from './last-applicant-section-summary/last-applicant-section-summary.component';
import { LastApplicantSectionViewComponent } from './last-applicant-section-view/last-applicant-section-view.component';

@Component({
	selector: 'app-last-applicant-section',
	templateUrl: './last-applicant-section.component.html',
	styleUrls: ['./last-applicant-section.component.scss'],
	imports: [LastApplicantSectionViewComponent, LastApplicantSectionEditComponent, LastApplicantSectionSummaryComponent],
})
export class LastApplicantSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<V3TechRecordModel>();
}

type Mode = 'view' | 'edit' | 'summary';
