import { Component, input } from '@angular/core';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';

import { TypeApprovalSectionEditComponent } from './type-approval-section-edit/type-approval-section-edit.component';
import { TypeApprovalSectionSummaryComponent } from './type-approval-section-summary/type-approval-section-summary.component';
import { TypeApprovalSectionViewComponent } from './type-approval-section-view/type-approval-section-view.component';

@Component({
	selector: 'app-type-approval-section',
	templateUrl: './type-approval-section.component.html',
	styleUrls: ['./type-approval-section.component.scss'],
	imports: [TypeApprovalSectionViewComponent, TypeApprovalSectionEditComponent, TypeApprovalSectionSummaryComponent],
})
export class TypeApprovalSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<V3TechRecordModel>();
}

type Mode = 'view' | 'edit' | 'summary';
