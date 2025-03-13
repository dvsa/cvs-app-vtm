import { Component, inject } from '@angular/core';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { State } from '@store/index';
import { techRecord } from '@store/technical-records';

@Component({
	selector: 'app-trl-purchasers-section-view',
	templateUrl: './trl-purchasers-section-view.component.html',
	styleUrls: ['./trl-purchasers-section-view.component.scss'],
})
export class TRLPurchasersSectionViewComponent {
	protected readonly VehicleTypes = VehicleTypes;
	protected readonly store = inject<Store<State>>(Store);

	techRecord = this.store.selectSignal(techRecord);
}
