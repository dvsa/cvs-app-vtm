import { TechnicalRecordChangesService } from '@/src/app/services/technical-record/technical-record-change.service';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { editingTechRecord } from '@store/technical-records';

@Component({
	selector: 'app-documents-section-summary',
	templateUrl: './documents-section-summary.component.html',
	styleUrls: ['./documents-section-summary.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, DefaultNullOrEmpty],
})
export class DocumentsSectionSummaryComponent {
	readonly VehicleTypes = VehicleTypes;

	store = inject(Store);
	tcs = inject(TechnicalRecordChangesService);

	amendedTechRecord = this.store.selectSignal(editingTechRecord);
}
