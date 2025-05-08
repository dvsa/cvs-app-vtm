import { DatePipe } from '@angular/common';
import { Component, Signal, inject } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { techRecord } from '@store/technical-records';

@Component({
	selector: 'app-authorisation-into-service-section-view',
	templateUrl: './authorisation-into-service-section-view.component.html',
	styleUrls: ['./authorisation-into-service-section-view.component.scss'],
	imports: [DatePipe, DefaultNullOrEmpty],
})
export class AuthorisationIntoServiceSectionViewComponent {
	protected readonly VehicleTypes = VehicleTypes;
	store = inject(Store);
	technicalRecordService = inject(TechnicalRecordService);
	techRecord = this.store.selectSignal(techRecord) as Signal<TechRecordType<'trl'>>;
}
