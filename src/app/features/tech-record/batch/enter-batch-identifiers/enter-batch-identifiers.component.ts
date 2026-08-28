import {
	selectBatchDetails,
	selectBatchVehicleTypeDescriptor,
} from '@/src/app/store/technical-records/batch-create.selectors';
import { Component, computed, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-enter-batch-identifiers',
	templateUrl: './enter-batch-identifiers.component.html',
	styleUrls: ['./enter-batch-identifiers.component.scss'],
})
export class EnterBatchIdentifiers {
	readonly store = inject(Store);
	readonly title = inject(Title);

	readonly savedBatchDetails = this.store.selectSignal(selectBatchDetails);
	readonly vehicleTypeDescriptor = this.store.selectSignal(selectBatchVehicleTypeDescriptor);
	readonly pageTitle = computed(() => this.computePageTitle());

	constructor() {
		effect(() => this.title.setTitle(this.pageTitle()));
	}

	computePageTitle(): string {
		return `Enter details for each ${this.vehicleTypeDescriptor()}`;
	}
}
