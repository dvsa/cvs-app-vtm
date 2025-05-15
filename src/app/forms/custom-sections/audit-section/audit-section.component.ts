import { V3TechRecordModel } from '@/src/app/models/vehicle-tech-record.model';
import { Component, input } from '@angular/core';
import { AuditSectionSummaryComponent } from './audit-section-summary/audit-section-summary.component';
import { AuditSectionViewComponent } from './audit-section-view/audit-section-view.component';

@Component({
	selector: 'app-audit-section',
	templateUrl: './audit-section.component.html',
	styleUrls: ['./audit-section.component.scss'],
	imports: [AuditSectionViewComponent, AuditSectionSummaryComponent],
})
export class AuditSectionComponent {
	mode = input<Mode>('edit');
	techRecord = input.required<V3TechRecordModel>();
}

type Mode = 'view' | 'edit' | 'summary';
