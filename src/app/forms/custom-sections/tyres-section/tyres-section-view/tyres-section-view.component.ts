import { Component, inject } from '@angular/core';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { techRecord } from '@store/technical-records';
import { indexOf } from 'lodash';

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
	protected readonly indexOf = indexOf;
}
