import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { techRecord } from '@store/technical-records';

@Component({
	selector: 'app-vehicle-section-summary',
	templateUrl: './vehicle-section-summary.component.html',
	styleUrls: ['./vehicle-section-summary.component.scss'],
})
export class VehicleSectionSummaryComponent {
	store = inject(Store);

	techRecord = this.store.selectSignal(techRecord);
}
