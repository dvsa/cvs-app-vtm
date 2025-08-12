import { AxlesService } from '@/src/app/services/axles/axles.service';
import { Component, inject } from '@angular/core';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { DefaultNullOrEmpty } from '@pipes/default-null-or-empty/default-null-or-empty.pipe';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { techRecord } from '@store/technical-records';

@Component({
	selector: 'app-weights-section-view',
	templateUrl: './weights-section-view.component.html',
	styleUrls: ['./weights-section-view.component.scss'],
	imports: [DefaultNullOrEmpty],
})
export class WeightsSectionViewComponent {
	protected readonly VehicleTypes = VehicleTypes;

	store = inject(Store);
	technicalRecordService = inject(TechnicalRecordService);
	axlesService = inject(AxlesService);
	techRecord = this.store.selectSignal(techRecord);
}
