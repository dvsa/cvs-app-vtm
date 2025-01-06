import { Component, Signal, inject } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { Axle, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { editingTechRecord, techRecord } from '@store/technical-records';
import { isEqual } from 'lodash';

@Component({
	selector: 'app-weights-section-summary',
	templateUrl: './weights-section-summary.component.html',
	styleUrls: ['./weights-section-summary.component.scss'],
})
export class WeightsSectionSummaryComponent {
	protected readonly VehicleTypes = VehicleTypes;

	store = inject(Store);

	currentTechRecord = this.store.selectSignal(techRecord) as Signal<TechRecordType<'hgv' | 'psv' | 'trl'>>;
	amendedTechRecord = this.store.selectSignal(editingTechRecord) as Signal<TechRecordType<'hgv' | 'psv' | 'trl'>>;

	hasAxleChanged(amended: Axle | null | undefined): boolean {
		if (!amended) return true;
		const current = this.currentTechRecord()?.techRecord_axles?.find((axle) => axle.axleNumber === amended.axleNumber);
		if (!current) return true;
		return !isEqual(current, amended);
	}

	hasChanged(property: string) {
		const current = this.currentTechRecord();
		const amended = this.amendedTechRecord();
		if (!current || !amended) return true;

		return !isEqual(
			current[property as keyof TechRecordType<'hgv' | 'psv' | 'trl'>],
			amended[property as keyof TechRecordType<'hgv' | 'psv' | 'trl'>]
		);
	}

	hasHGVOrTRLGrossAxleChanged() {
		return [
			this.hasChanged('techRecord_grossEecWeight'),
			this.hasChanged('techRecord_grossDesignWeight'),
			this.hasChanged('techRecord_grossGbWeight'),
		].some(Boolean);
	}

	hasPsvGrossAxleChanged() {
		return [
			this.hasChanged('techRecord_grossKerbWeight'),
			this.hasChanged('techRecord_grossLadenWeight'),
			this.hasChanged('techRecord_grossGbWeight'),
			this.hasChanged('techRecord_grossDesignWeight'),
		].some(Boolean);
	}

	hasHgvTrainAxleChanged() {
		return [
			this.hasChanged('techRecord_trainDesignWeight'),
			this.hasChanged('techRecord_trainGbWeight'),
			this.hasChanged('techRecord_trainEecWeight'),
		].some(Boolean);
	}

	hasPsvTrainAxleChanged() {
		return [
			this.hasChanged('techRecord_maxTrainGbWeight'),
			this.hasAxleChanged('techRecord_trainDesignWeight' as any),
		].some(Boolean);
	}

	hasMaxTrainAxleChanged() {
		return [
			this.hasChanged('techRecord_maxTrainDesignWeight'),
			this.hasChanged('techRecord_maxTrainEecWeight'),
			this.hasChanged('techRecord_maxTrainGbWeight'),
		].some(Boolean);
	}
}
