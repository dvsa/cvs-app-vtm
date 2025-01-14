import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { Component, inject } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType as TechRecordTypeVerb } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { editingTechRecord, techRecord } from '@store/technical-records';
import { isEqual } from 'lodash';

@Component({
	selector: 'app-tyres-section-summary',
	templateUrl: './tyres-section-summary.component.html',
	styleUrls: ['./tyres-section-summary.component.scss'],
})
export class TyresSectionSummaryComponent {
	protected readonly VehicleTypes = VehicleTypes;

	store = inject(Store);
	technicalRecordService = inject(TechnicalRecordService);

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

	hasAxleChanged(index: number): boolean {
		const currentAxle = (this.currentTechRecord() as TechRecordType<'hgv' | 'psv' | 'trl'>)?.techRecord_axles?.[index];
		const amendedAxle = (this.amendedTechRecord() as TechRecordType<'hgv' | 'psv' | 'trl'>)?.techRecord_axles?.[index];
		if (!currentAxle || !amendedAxle) return true;

		return !isEqual(currentAxle, amendedAxle);
	}
}
