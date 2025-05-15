import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { Store } from '@ngrx/store';
import { editingTechRecord, techRecord } from '@store/technical-records';
import { isEqual } from 'lodash';
import { DefaultNullOrEmpty } from '../../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
	selector: 'app-type-approval-section-summary',
	templateUrl: './type-approval-section-summary.component.html',
	styleUrls: ['./type-approval-section-summary.component.scss'],
	imports: [DatePipe, DefaultNullOrEmpty],
})
export class TypeApprovalSectionSummaryComponent {
	store = inject(Store);
	technicalRecordService = inject(TechnicalRecordService);

	currentTechRecord = this.store.selectSignal(techRecord);
	amendedTechRecord = this.store.selectSignal(editingTechRecord);

	hasChanged(property: string) {
		const current = this.currentTechRecord();
		const amended = this.amendedTechRecord();
		if (!current || !amended) return true;

		return !isEqual(current[property as keyof TechRecordType<'put'>], amended[property as keyof TechRecordType<'put'>]);
	}

	protected readonly VehicleTypes = VehicleTypes;
}
