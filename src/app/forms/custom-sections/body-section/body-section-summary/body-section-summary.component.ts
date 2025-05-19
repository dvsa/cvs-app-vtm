import { TechnicalRecordChangesService } from '@/src/app/services/technical-record/technical-record-change.service';
import { NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { editingTechRecord } from '@store/technical-records';
import { DefaultNullOrEmpty } from '../../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
	selector: 'app-body-section-summary',
	templateUrl: './body-section-summary.component.html',
	styleUrls: ['./body-section-summary.component.scss'],
	imports: [NgTemplateOutlet, DefaultNullOrEmpty],
})
export class BodySectionSummaryComponent {
	protected readonly VehicleTypes = VehicleTypes;
	store = inject(Store);
	tcs = inject(TechnicalRecordChangesService);

	amendedTechRecord = this.store.selectSignal(editingTechRecord);
}
