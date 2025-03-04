import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { Component, inject } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { Store } from '@ngrx/store';
import { editingTechRecord, techRecord } from '@store/technical-records';
import { isEqual } from 'lodash';

@Component({
	selector: 'app-last-applicant-section-summary',
	templateUrl: './last-applicant-section-summary.component.html',
	styleUrls: ['./last-applicant-section-summary.component.scss'],
})
export class LastApplicantSectionSummaryComponent {
	store = inject(Store);
	technicalRecordService = inject(TechnicalRecordService);

	currentTechRecord = this.store.selectSignal(techRecord);
	amendedTechRecord = this.store.selectSignal(editingTechRecord);

	hasChanged(property: string) {
		const current = this.currentTechRecord();
		const amended = this.amendedTechRecord();

		if (!current || !amended) return true;

		const currentValue = current[property as keyof TechRecordType<'put'>];
		const amendedValue = amended[property as keyof TechRecordType<'put'>];

		// If the property is edited, exclude certain changes
		if (currentValue == null && Array.isArray(amendedValue) && amendedValue.length === 0) return false;

		return !isEqual(currentValue, amendedValue);
	}

	protected readonly VehicleTypes = VehicleTypes;
}
