import { Injectable, inject } from '@angular/core';
import { MultiOptions } from '@models/options.model';
import { Store } from '@ngrx/store';
import { testStations } from '@store/test-stations';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TestStationsService {
	private store = inject(Store);

	getTestStationsOptions(): Observable<MultiOptions> {
		return this.store.select(testStations).pipe(
			map((allTestStations) =>
				allTestStations
					.sort((a, b) => a.testStationName.localeCompare(b.testStationName))
					.map((testStation) => {
						const label = `${testStation.testStationName} - ${testStation.testStationPNumber}`;
						return { value: testStation.testStationPNumber, label };
					})
			)
		);
	}
}
