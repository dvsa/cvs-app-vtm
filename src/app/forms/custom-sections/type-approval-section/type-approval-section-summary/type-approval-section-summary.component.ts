import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { TechnicalRecordChangesService } from '@/src/app/services/technical-record/technical-record-change.service';
import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { editingTechRecord } from '@store/technical-records';
import { DefaultNullOrEmpty } from '../../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
	selector: 'app-type-approval-section-summary',
	templateUrl: './type-approval-section-summary.component.html',
	styleUrls: ['./type-approval-section-summary.component.scss'],
	imports: [DatePipe, DefaultNullOrEmpty],
})
export class TypeApprovalSectionSummaryComponent {
	store = inject(Store);
	tcs = inject(TechnicalRecordChangesService);

	amendedTechRecord = this.store.selectSignal(editingTechRecord);

	protected readonly VehicleTypes = VehicleTypes;
}
