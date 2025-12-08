import { Modes } from '@/src/app/models/modes.enum';
import { Component, input } from '@angular/core';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { AuditSectionSummaryComponent } from './audit-section-summary/audit-section-summary.component';
import { AuditSectionViewComponent } from './audit-section-view/audit-section-view.component';

@Component({
	selector: 'app-audit-section',
	templateUrl: './audit-section.component.html',
	styleUrls: ['./audit-section.component.scss'],
	imports: [AuditSectionViewComponent, AuditSectionSummaryComponent],
})
export class AuditSectionComponent {
	mode = input<Modes>(Modes.EDIT);
	techRecord = input.required<V3TechRecordModel>();
}
