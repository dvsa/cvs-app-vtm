import { V3TechRecordModel } from '@/src/app/models/vehicle-tech-record.model';
import { Component, input } from '@angular/core';
import { AuthorisationIntoServiceSectionEditComponent } from '@forms/custom-sections/authorisation-into-service-section/authorisation-into-service-edit/authorisation-into-service-section-edit.component';
import { AuthorisationIntoServiceSectionSummaryComponent } from '@forms/custom-sections/authorisation-into-service-section/authorisation-into-service-summary/authorisation-into-service-section-summary.component';
import { AuthorisationIntoServiceSectionViewComponent } from '@forms/custom-sections/authorisation-into-service-section/authorisation-into-service-view/authorisation-into-service-section-view.component';

@Component({
	selector: 'app-authorisation-into-service-section',
	templateUrl: './authorisation-into-service-section.component.html',
	styleUrls: ['./authorisation-into-service-section.component.scss'],
	imports: [
		AuthorisationIntoServiceSectionViewComponent,
		AuthorisationIntoServiceSectionSummaryComponent,
		AuthorisationIntoServiceSectionEditComponent,
	],
})
export class AuthorisationIntoServiceSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<V3TechRecordModel>();
}

type Mode = 'view' | 'edit' | 'summary';
