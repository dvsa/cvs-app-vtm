import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { Component, inject } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { editingTechRecord, techRecord } from '@store/technical-records';
import { isEqual } from 'lodash';

@Component({
	selector: 'app-authorisation-into-service-section-summary',
	templateUrl: './authorisation-into-service-section-summary.component.html',
	styleUrls: ['./authorisation-into-service-section-summary.component.scss'],
	imports: [],
})
export class AuthorisationIntoServiceSectionSummaryComponent {
	protected readonly VehicleTypes = VehicleTypes;
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
}
