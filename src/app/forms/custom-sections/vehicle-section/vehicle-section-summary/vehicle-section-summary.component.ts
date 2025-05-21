import {
	ALL_VEHICLE_CLASS_DESCRIPTION_OPTIONS,
	COUPLING_TYPE_OPTIONS,
	HGV_VEHICLE_CLASS_DESCRIPTION_OPTIONS,
	PSV_VEHICLE_CLASS_DESCRIPTION_OPTIONS,
	SUSPENSION_TYRE_OPTIONS,
	TRL_VEHICLE_CLASS_DESCRIPTION_OPTIONS,
} from '@/src/app/models/options.model';
import { VehicleTypes } from '@/src/app/models/vehicle-tech-record.model';
import { TechnicalRecordChangesService } from '@/src/app/services/technical-record/technical-record-change.service';
import { TechnicalRecordService } from '@/src/app/services/technical-record/technical-record.service';
import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { editingTechRecord, techRecord } from '@store/technical-records';
import { DefaultNullOrEmpty } from '../../../../pipes/default-null-or-empty/default-null-or-empty.pipe';
import { MultiOptionPipe } from '../../../../pipes/multi-option/multi-option.pipe';

@Component({
	selector: 'app-vehicle-section-summary',
	templateUrl: './vehicle-section-summary.component.html',
	styleUrls: ['./vehicle-section-summary.component.scss'],
	imports: [DatePipe, DefaultNullOrEmpty, MultiOptionPipe],
})
export class VehicleSectionSummaryComponent {
	readonly VehicleTypes = VehicleTypes;
	readonly HGV_VEHICLE_CLASS_DESCRIPTION_OPTIONS = HGV_VEHICLE_CLASS_DESCRIPTION_OPTIONS;
	readonly TRL_VEHICLE_CLASS_DESCRIPTION_OPTIONS = TRL_VEHICLE_CLASS_DESCRIPTION_OPTIONS;
	readonly PSV_VEHICLE_CLASS_DESCRIPTION_OPTIONS = PSV_VEHICLE_CLASS_DESCRIPTION_OPTIONS;
	readonly ALL_VEHICLE_CLASS_DESCRIPTION_OPTIONS = ALL_VEHICLE_CLASS_DESCRIPTION_OPTIONS;
	readonly SUSPENSION_TYRE_OPTIONS = SUSPENSION_TYRE_OPTIONS;
	readonly COUPLING_TYPE_OPTIONS = COUPLING_TYPE_OPTIONS;

	store = inject(Store);
	tcs = inject(TechnicalRecordChangesService);
	technicalRecordService = inject(TechnicalRecordService);

	currentTechRecord = this.store.selectSignal(techRecord);
	amendedTechRecord = this.store.selectSignal(editingTechRecord);

	get displaySeatsHeading(): boolean {
		return (
			this.tcs.hasChanged('techRecord_seatsUpperDeck') ||
			this.tcs.hasChanged('techRecord_seatsLowerDeck') ||
			this.tcs.hasChanged('techRecord_standingCapacity')
		);
	}
}
