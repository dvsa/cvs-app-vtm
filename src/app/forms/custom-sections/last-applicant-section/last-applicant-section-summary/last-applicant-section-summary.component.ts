import { Component, inject } from '@angular/core';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TechnicalRecordChangesService } from '@services/technical-record/technical-record-change.service';
import { editingTechRecord } from '@store/technical-records';

@Component({
	selector: 'app-last-applicant-section-summary',
	templateUrl: './last-applicant-section-summary.component.html',
	styleUrls: ['./last-applicant-section-summary.component.scss'],
	imports: [DefaultNullOrEmpty],
})
export class LastApplicantSectionSummaryComponent {
	store = inject(Store);
	tcs = inject(TechnicalRecordChangesService);

	amendedTechRecord = this.store.selectSignal(editingTechRecord);

	protected readonly VehicleTypes = VehicleTypes;
}
