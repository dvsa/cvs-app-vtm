import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RecallsSchema } from '@dvsa/cvs-type-definitions/types/v1/recalls';
import { Store, select } from '@ngrx/store';
import { Observable, catchError, filter, of, switchMap, tap } from 'rxjs';
import { VehicleTypes } from '../../models/vehicle-tech-record.model';
import { HttpService } from '../../services/http/http.service';
import { techRecord } from '../../store/technical-records';
import { patchEditingTestResult } from '../../store/test-records';

export const recallsResolver: ResolveFn<Observable<RecallsSchema | undefined>> = () => {
	const store = inject(Store);
	const httpService = inject(HttpService);

	return store.pipe(
		select(techRecord),
		filter(Boolean),
		switchMap((record) => {
			if (
				record.techRecord_vehicleType === VehicleTypes.HGV ||
				record.techRecord_vehicleType === VehicleTypes.PSV ||
				record.techRecord_vehicleType === VehicleTypes.TRL
			) {
				return httpService.getRecalls(record.vin).pipe(
					tap((recalls) => store.dispatch(patchEditingTestResult({ testResult: { recalls } }))),
					catchError(() => of(undefined))
				);
			}

			return of(undefined);
		})
	);
};
