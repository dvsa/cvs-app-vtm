import { Component, inject } from '@angular/core';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordChangesService } from '@services/technical-record/technical-record-change.service';
import { editingTechRecord } from '@store/technical-records';

@Component({
	selector: 'app-reason-for-creation-section-summary',
	templateUrl: './reason-for-creation-summary.component.html',
	styleUrls: ['./reason-for-creation-summary.component.scss'],
	imports: [],
})
export class ReasonForCreationSectionSummaryComponent {
	store = inject(Store);
	tcs = inject(TechnicalRecordChangesService);

	amendedTechRecord = this.store.selectSignal(editingTechRecord);

	protected readonly VehicleTypes = VehicleTypes;
}
