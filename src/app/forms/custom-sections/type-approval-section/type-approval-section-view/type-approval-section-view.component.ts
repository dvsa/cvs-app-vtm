import { Component, inject } from '@angular/core';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { State } from '@store/index';
import { techRecord } from '@store/technical-records';

@Component({
	selector: 'app-type-approval-section-view',
	templateUrl: './type-approval-section-view.component.html',
	styleUrls: ['./type-approval-section-view.component.scss'],
})
export class TypeApprovalSectionViewComponent {
	protected readonly VehicleTypes = VehicleTypes;
	protected readonly store = inject<Store<State>>(Store);

	techRecord = this.store.selectSignal(techRecord);
}
