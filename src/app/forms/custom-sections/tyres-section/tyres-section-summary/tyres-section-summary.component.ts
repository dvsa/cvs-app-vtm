import { Component, inject } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TechnicalRecordChangesService } from '@services/technical-record/technical-record-change.service';
import { editingTechRecord, techRecord } from '@store/technical-records';
import { isEqual } from 'lodash';

@Component({
	selector: 'app-tyres-section-summary',
	templateUrl: './tyres-section-summary.component.html',
	styleUrls: ['./tyres-section-summary.component.scss'],
	imports: [DefaultNullOrEmpty],
})
export class TyresSectionSummaryComponent {
	protected readonly VehicleTypes = VehicleTypes;

	store = inject(Store);
	tcs = inject(TechnicalRecordChangesService);

	currentTechRecord = this.store.selectSignal(techRecord);
	amendedTechRecord = this.store.selectSignal(editingTechRecord);

	hasAxleChanged(index: number): boolean {
		const currentAxle = (this.currentTechRecord() as TechRecordType<'hgv' | 'psv' | 'trl'>)?.techRecord_axles?.[index];
		const amendedAxle = (this.amendedTechRecord() as TechRecordType<'hgv' | 'psv' | 'trl'>)?.techRecord_axles?.[index];
		if (!currentAxle || !amendedAxle) return true;

		return !isEqual(currentAxle, amendedAxle);
	}

	get shouldShowTable(): boolean {
		const axles = (this.amendedTechRecord() as TechRecordType<'hgv' | 'psv' | 'trl'>)?.techRecord_axles;
		if (!Array.isArray(axles)) return false;
		return axles.length > 0 && axles.some((_, index) => this.hasAxleChanged(index));
	}
}
