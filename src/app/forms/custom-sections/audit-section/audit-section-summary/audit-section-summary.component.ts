import { DatePipe } from '@angular/common';
import { Component, Signal, inject } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TechnicalRecordChangesService } from '@services/technical-record/technical-record-change.service';
import { editingTechRecord, techRecord } from '@store/technical-records';

@Component({
	selector: 'app-audit-section-summary',
	templateUrl: './audit-section-summary.component.html',
	styleUrls: ['./audit-section-summary.component.scss'],
	imports: [DatePipe, DefaultNullOrEmpty],
})
export class AuditSectionSummaryComponent {
	store = inject(Store);
	tcs = inject(TechnicalRecordChangesService);

	currentTechRecord = this.store.selectSignal(techRecord);
	amendedTechRecord = this.store.selectSignal(editingTechRecord) as Signal<TechRecordType<'get'>>;
}
