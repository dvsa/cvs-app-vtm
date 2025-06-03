import { Component, inject } from '@angular/core';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { techRecord } from '@store/technical-records';
import { ReplaySubject } from 'rxjs';
import { DefaultNullOrEmpty } from '../../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
	selector: 'app-tyres-section-view',
	templateUrl: './tyres-section-view.component.html',
	styleUrls: ['./tyres-section-view.component.scss'],
	imports: [DefaultNullOrEmpty],
})
export class TyresSectionViewComponent {
	protected readonly VehicleTypes = VehicleTypes;

	store = inject(Store);
	technicalRecordService = inject(TechnicalRecordService);
	techRecord = this.store.selectSignal(techRecord);
	invalidAxles: Array<number> = [];
	referenceDataService = inject(ReferenceDataService);
	destroy$ = new ReplaySubject<boolean>(1);
}
