import { DatePipe } from '@angular/common';
import { Component, Signal, inject } from '@angular/core';
import { TechRecordType as TechRecordVehicleType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TechnicalRecordChangesService } from '@services/technical-record/technical-record-change.service';
import { editingTechRecord } from '@store/technical-records';

@Component({
	selector: 'app-authorisation-into-service-section-summary',
	templateUrl: './authorisation-into-service-section-summary.component.html',
	styleUrls: ['./authorisation-into-service-section-summary.component.scss'],
	imports: [DatePipe, DefaultNullOrEmpty],
})
export class AuthorisationIntoServiceSectionSummaryComponent {
	protected readonly VehicleTypes = VehicleTypes;
	store = inject(Store);
	tcs = inject(TechnicalRecordChangesService);

	amendedTechRecord = this.store.selectSignal(editingTechRecord) as Signal<TechRecordVehicleType<'trl'>>;
}
