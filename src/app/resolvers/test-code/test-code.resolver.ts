import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { HttpService } from '@services/http/http.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { techRecord } from '@store/technical-records';
import { setTestResultLoading } from '@store/test-records';
import { Observable, catchError, finalize, map, of, switchMap, tap } from 'rxjs';

export const testCodeResolver: ResolveFn<Observable<string | undefined>> = (route) => {
	const store = inject(Store);
	const httpService = inject(HttpService);
	const techRecordService = inject(TechnicalRecordService);
	const testTypeId: string | undefined = route.queryParams['testType'];

	// fetch test code from back-end (because its not provided by reference data)
	return store.pipe(
		select(techRecord),
		tap(() => store.dispatch(setTestResultLoading({ loading: true }))),
		switchMap((record) => {
			return httpService.getTestTypesid(
				String(testTypeId),
				['defaultTestCode'],
				record!.techRecord_vehicleType,
				techRecordService.getVehicleSize(record!) as string,
				record!.techRecord_vehicleConfiguration!,
				record!.techRecord_noOfAxles!,
				record!.techRecord_euVehicleCategory!,
				techRecordService.getVehicleClass(record!) as string,
				techRecordService.getVehicleSubClass(record!)?.[0] as string
			);
		}),
		map((response) => response.defaultTestCode),
		catchError(() => of('')), // ensure error response doesn't prevent test creation
		finalize(() => store.dispatch(setTestResultLoading({ loading: false })))
	);
};
