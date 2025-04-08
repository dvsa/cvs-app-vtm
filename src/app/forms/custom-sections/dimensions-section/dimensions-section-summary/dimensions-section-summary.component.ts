import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { Component, inject } from '@angular/core';
import { TechRecordType as TechRecordTypeVerb } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { Store } from '@ngrx/store';
import { editingTechRecord, techRecord } from '@store/technical-records';
import { isEqual } from 'lodash';

import { DefaultNullOrEmpty } from '../../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
	selector: 'app-dimensions-section-summary',
	templateUrl: './dimensions-section-summary.component.html',
	styleUrls: ['./dimensions-section-summary.component.scss'],
	imports: [DefaultNullOrEmpty],
})
export class DimenionsSectionSummaryComponent {
	readonly VehicleTypes = VehicleTypes;

	store = inject(Store);

	currentTechRecord = this.store.selectSignal(techRecord);
	amendedTechRecord = this.store.selectSignal(editingTechRecord);

	hasChanged(property: string) {
		const current = this.currentTechRecord();
		const amended = this.amendedTechRecord();
		if (!current || !amended) return true;

		return !isEqual(
			current[property as keyof TechRecordTypeVerb<'put'>],
			amended[property as keyof TechRecordTypeVerb<'put'>]
		);
	}
}
