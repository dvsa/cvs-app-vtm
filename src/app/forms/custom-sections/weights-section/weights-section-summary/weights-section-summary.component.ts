import { Component, Signal, inject } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { Axle, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TechnicalRecordChangesService } from '@services/technical-record/technical-record-change.service';
import { editingTechRecord, techRecord } from '@store/technical-records';
import { isEqual } from 'lodash';

@Component({
	selector: 'app-weights-section-summary',
	templateUrl: './weights-section-summary.component.html',
	styleUrls: ['./weights-section-summary.component.scss'],
	imports: [DefaultNullOrEmpty],
})
export class WeightsSectionSummaryComponent {
	protected readonly VehicleTypes = VehicleTypes;

	store = inject(Store);
	tcs = inject(TechnicalRecordChangesService);

	currentTechRecord = this.store.selectSignal(techRecord) as Signal<TechRecordType<'hgv' | 'psv' | 'trl'>>;
	amendedTechRecord = this.store.selectSignal(editingTechRecord) as Signal<TechRecordType<'hgv' | 'psv' | 'trl'>>;

	hasAxleChanged(amended: Axle | null | undefined): boolean {
		if (!amended) return true;
		const current = this.currentTechRecord()?.techRecord_axles?.find((axle) => axle.axleNumber === amended.axleNumber);
		if (!current) return true;
		return !isEqual(current, amended);
	}

	hasHGVOrTRLGrossAxleChanged() {
		return [
			this.tcs.hasChanged('techRecord_grossEecWeight'),
			this.tcs.hasChanged('techRecord_grossDesignWeight'),
			this.tcs.hasChanged('techRecord_grossGbWeight'),
		].some(Boolean);
	}

	hasPsvGrossAxleChanged() {
		return [
			this.tcs.hasChanged('techRecord_grossKerbWeight'),
			this.tcs.hasChanged('techRecord_grossLadenWeight'),
			this.tcs.hasChanged('techRecord_grossGbWeight'),
			this.tcs.hasChanged('techRecord_grossDesignWeight'),
		].some(Boolean);
	}

	hasHgvTrainAxleChanged() {
		return [
			this.tcs.hasChanged('techRecord_trainDesignWeight'),
			this.tcs.hasChanged('techRecord_trainGbWeight'),
			this.tcs.hasChanged('techRecord_trainEecWeight'),
		].some(Boolean);
	}

	hasPsvTrainAxleChanged() {
		return [
			this.tcs.hasChanged('techRecord_maxTrainGbWeight'),
			this.hasAxleChanged('techRecord_trainDesignWeight' as any),
		].some(Boolean);
	}

	hasMaxTrainAxleChanged() {
		return [
			this.tcs.hasChanged('techRecord_maxTrainDesignWeight'),
			this.tcs.hasChanged('techRecord_maxTrainEecWeight'),
			this.tcs.hasChanged('techRecord_maxTrainGbWeight'),
		].some(Boolean);
	}
}
