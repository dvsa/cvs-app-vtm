import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { editingTechRecord } from '@store/technical-records';

import { TechnicalRecordChangesService } from '@/src/app/services/technical-record/technical-record-change.service';
import { DefaultNullOrEmpty } from '../../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
	selector: 'app-trl-purchasers-section-summary',
	templateUrl: './trl-purchasers-section-summary.component.html',
	styleUrls: ['./trl-purchasers-section-summary.component.scss'],
	imports: [DefaultNullOrEmpty],
})
export class TRLPurchasersSectionSummaryComponent {
	store = inject(Store);
	tcs = inject(TechnicalRecordChangesService);

	amendedTechRecord = this.store.selectSignal(editingTechRecord);

	protected readonly VehicleTypes = VehicleTypes;
}
