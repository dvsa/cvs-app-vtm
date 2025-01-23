import { Component, input } from '@angular/core';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
	selector: 'app-type-approval-section',
	templateUrl: './type-approval-section.component.html',
	styleUrls: ['./type-approval-section.component.scss'],
})
export class TypeApprovalSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<V3TechRecordModel>();
}

type Mode = 'view' | 'edit' | 'summary';
