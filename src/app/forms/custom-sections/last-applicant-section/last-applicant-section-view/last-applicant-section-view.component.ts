import { Component, inject } from '@angular/core';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { techRecord } from '@store/technical-records';

@Component({
	selector: 'app-last-applicant-section-view',
	templateUrl: './last-applicant-section-view.component.html',
	styleUrls: ['./last-applicant-section-view.component.scss'],
})
export class LastApplicantSectionViewComponent {
	protected readonly VehicleTypes = VehicleTypes;
	store = inject(Store);
	technicalRecordService = inject(TechnicalRecordService);
	techRecord = this.store.selectSignal(techRecord);
}
