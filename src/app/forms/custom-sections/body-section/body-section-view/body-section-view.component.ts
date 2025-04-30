import { NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { techRecord } from '@store/technical-records';
import { DefaultNullOrEmpty } from '../../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
	selector: 'app-body-section-view',
	templateUrl: './body-section-view.component.html',
	styleUrls: ['./body-section-view.component.scss'],
	imports: [NgTemplateOutlet, DefaultNullOrEmpty],
})
export class BodySectionViewComponent {
	protected readonly VehicleTypes = VehicleTypes;
	store = inject(Store);
	technicalRecordService = inject(TechnicalRecordService);
	techRecord = this.store.selectSignal(techRecord);
}
