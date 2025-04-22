import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TechRecordType as TechRecordTypeVerb } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { editingTechRecord, techRecord } from '@store/technical-records';
import { isEqual } from 'lodash';

@Component({
	selector: 'app-documents-section-summary',
	templateUrl: './documents-section-summary.component.html',
	styleUrls: ['./documents-section-summary.component.scss'],
	imports: [FormsModule, ReactiveFormsModule, DefaultNullOrEmpty],
})
export class DocumentsSectionSummaryComponent {
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
