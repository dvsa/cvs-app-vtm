import { Component, input } from '@angular/core';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { ReasonForCreationSectionEditComponent } from './reason-for-creation-edit/reason-for-creation-edit.component';
import { ReasonForCreationSectionSummaryComponent } from './reason-for-creation-summary/reason-for-creation-summary.component';
import { ReasonForCreationSectionViewComponent } from './reason-for-creation-view/reason-for-creation-view.component';

@Component({
	selector: 'app-reason-for-creation-section',
	templateUrl: './reason-for-creation-section.component.html',
	styleUrls: ['./reason-for-creation-section.component.scss'],
	imports: [
		ReasonForCreationSectionViewComponent,
		ReasonForCreationSectionEditComponent,
		ReasonForCreationSectionSummaryComponent,
	],
})
export class ReasonForCreationSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<V3TechRecordModel>();
}

type Mode = 'view' | 'edit' | 'summary';
