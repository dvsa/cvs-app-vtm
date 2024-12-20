import { Component, inject } from '@angular/core';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { techRecord } from '@store/technical-records';

@Component({
	selector: 'app-tyres-section-view',
	templateUrl: './tyres-section-view.component.html',
	styleUrls: ['./tyres-section-view.component.scss'],
})
export class TyresSectionViewComponent {
	protected readonly VehicleTypes = VehicleTypes;

	store = inject(Store);
	technicalRecordService = inject(TechnicalRecordService);
	techRecord = this.store.selectSignal(techRecord);

	get psvAxles() {
		const techRecord = this.techRecord();
		if (techRecord?.techRecord_vehicleType === VehicleTypes.PSV) {
			return techRecord?.techRecord_axles;
		}
		return undefined;
	}
}
