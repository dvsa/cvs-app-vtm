import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { State } from '@store/index';
import { techRecord } from '@store/technical-records';
import { DefaultNullOrEmpty } from '../../../../pipes/default-null-or-empty/default-null-or-empty.pipe';

@Component({
	selector: 'app-type-approval-section-view',
	templateUrl: './type-approval-section-view.component.html',
	styleUrls: ['./type-approval-section-view.component.scss'],
	imports: [DatePipe, DefaultNullOrEmpty],
})
export class TypeApprovalSectionViewComponent {
	protected readonly VehicleTypes = VehicleTypes;
	protected readonly store = inject<Store<State>>(Store);

	techRecord = this.store.selectSignal(techRecord);
}
