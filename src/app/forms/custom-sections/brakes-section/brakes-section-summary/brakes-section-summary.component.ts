import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { DefaultNullOrEmpty } from '@/src/app/pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { editingTechRecord, techRecord } from '@store/technical-records';

@Component({
	selector: 'app-brakes-section-summary',
	templateUrl: './brakes-section-summary.component.html',
	styleUrls: ['./brakes-section-summary.component.scss'],
	imports: [DefaultNullOrEmpty],
})
export class BrakesSectionSummaryComponent {
	store = inject(Store);
	technicalRecordService = inject(TechnicalRecordService);

	currentTechRecord = this.store.selectSignal(techRecord);
	amendedTechRecord = this.store.selectSignal(editingTechRecord);

	round(n: number): number {
		return Math.round(n);
	}

	protected readonly VehicleTypes = VehicleTypes;
}
