import { Component, inject } from '@angular/core';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { techRecord } from '@store/technical-records';
import { ReplaySubject } from 'rxjs';

import { DefaultNullOrEmpty } from '../../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
	selector: 'app-dimensions-section-view',
	templateUrl: './dimensions-section-view.component.html',
	styleUrls: ['./dimensions-section-view.component.scss'],
	imports: [DefaultNullOrEmpty],
})
export class DimensionsSectionViewComponent {
	protected readonly VehicleTypes = VehicleTypes;

	store = inject(Store);
	techRecord = this.store.selectSignal(techRecord);
	destroy$ = new ReplaySubject<boolean>(1);
}
