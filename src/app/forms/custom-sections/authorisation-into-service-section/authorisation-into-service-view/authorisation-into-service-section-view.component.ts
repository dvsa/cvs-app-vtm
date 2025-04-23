import { Component, inject } from '@angular/core';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { techRecord } from '@store/technical-records';

@Component({
	selector: 'app-authorisation-into-service-section-view',
	templateUrl: './authorisation-into-service-section-view.component.html',
	styleUrls: ['./authorisation-into-service-section-view.component.scss'],
	imports: [],
})
export class AuthorisationIntoServiceSectionViewComponent {
	protected readonly VehicleTypes = VehicleTypes;
	store = inject(Store);
	technicalRecordService = inject(TechnicalRecordService);
	techRecord = this.store.selectSignal(techRecord);
}
