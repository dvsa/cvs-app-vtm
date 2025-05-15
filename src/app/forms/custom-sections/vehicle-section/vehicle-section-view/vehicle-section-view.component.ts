import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
	ALL_VEHICLE_CLASS_DESCRIPTION_OPTIONS,
	COUPLING_TYPE_OPTIONS,
	HGV_VEHICLE_CLASS_DESCRIPTION_OPTIONS,
	PSV_VEHICLE_CLASS_DESCRIPTION_OPTIONS,
	SUSPENSION_TYRE_OPTIONS,
	TRL_VEHICLE_CLASS_DESCRIPTION_OPTIONS,
} from '@models/options.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { techRecord } from '@store/technical-records';
import { DefaultNullOrEmpty } from '../../../../pipes/default-null-or-empty/default-null-or-empty.pipe';
import { MultiOptionPipe } from '../../../../pipes/multi-option/multi-option.pipe';

@Component({
	selector: 'app-vehicle-section-view',
	templateUrl: './vehicle-section-view.component.html',
	styleUrls: ['./vehicle-section-view.component.scss'],
	imports: [DatePipe, DefaultNullOrEmpty, MultiOptionPipe],
})
export class VehicleSectionViewComponent {
	readonly VehicleTypes = VehicleTypes;
	readonly HGV_VEHICLE_CLASS_DESCRIPTION_OPTIONS = HGV_VEHICLE_CLASS_DESCRIPTION_OPTIONS;
	readonly TRL_VEHICLE_CLASS_DESCRIPTION_OPTIONS = TRL_VEHICLE_CLASS_DESCRIPTION_OPTIONS;
	readonly PSV_VEHICLE_CLASS_DESCRIPTION_OPTIONS = PSV_VEHICLE_CLASS_DESCRIPTION_OPTIONS;
	readonly ALL_VEHICLE_CLASS_DESCRIPTION_OPTIONS = ALL_VEHICLE_CLASS_DESCRIPTION_OPTIONS;
	readonly SUSPENSION_TYRE_OPTIONS = SUSPENSION_TYRE_OPTIONS;
	readonly COUPLING_TYPE_OPTIONS = COUPLING_TYPE_OPTIONS;

	store = inject(Store);
	technicalRecordService = inject(TechnicalRecordService);

	techRecord = this.store.selectSignal(techRecord);
}
