import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { TechnicalRecordChangesService } from '@/src/app/services/technical-record/technical-record-change.service';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { editingTechRecord } from '@store/technical-records';

@Component({
	selector: 'app-manufacturer-section-summary',
	templateUrl: './manufacturer-section-summary.component.html',
	styleUrls: ['./manufacturer-section-summary.component.scss'],
	imports: [DefaultNullOrEmpty],
})
export class ManufacturerSectionSummaryComponent {
	store = inject(Store);
	tcs = inject(TechnicalRecordChangesService);

	amendedTechRecord = this.store.selectSignal(editingTechRecord);

	protected readonly VehicleTypes = VehicleTypes;
}
