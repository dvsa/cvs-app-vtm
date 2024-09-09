import { Injectable, inject } from '@angular/core';
import { TestTypesTaxonomy } from '@models/test-types/testTypesTaxonomy';
import { Store } from '@ngrx/store';
import { HttpService } from '@services/http/http.service';
import { testTypeIdChanged } from '@store/test-records';
import { fetchTestTypes } from '@store/test-types/test-types.actions';
import { selectTestTypesByVehicleType } from '@store/test-types/test-types.selectors';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class TestTypesService {
	store = inject(Store);
	httpService = inject(HttpService);

	get selectAllTestTypes$(): Observable<TestTypesTaxonomy> {
		return this.store.select(selectTestTypesByVehicleType);
	}

	fetchTestTypes(): void {
		this.store.dispatch(fetchTestTypes());
	}

	testTypeIdChanged(testTypeId: string): void {
		this.store.dispatch(testTypeIdChanged({ testTypeId }));
	}
}
