import { Injectable, inject } from '@angular/core';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import {
	ReferenceDataApiResponse,
	ReferenceDataApiResponseWithPagination,
} from '@models/reference-data/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { ReferenceDataService } from '@services/reference-data/reference-data.service';
import { State } from '@store/index';
import { testResultInEdit } from '@store/test-records';
import { catchError, map, mergeMap, of, switchMap, take } from 'rxjs';
import { handleNotFound, sortReferenceData } from './operators';
import {
	amendReferenceDataItem,
	amendReferenceDataItemFailure,
	amendReferenceDataItemSuccess,
	createReferenceDataItem,
	createReferenceDataItemFailure,
	createReferenceDataItemSuccess,
	deleteReferenceDataItem,
	deleteReferenceDataItemFailure,
	deleteReferenceDataItemSuccess,
	fetchReasonsForAbandoning,
	fetchReferenceData,
	fetchReferenceDataAudit,
	fetchReferenceDataAuditFailed,
	fetchReferenceDataAuditSuccess,
	fetchReferenceDataByKey,
	fetchReferenceDataByKeyFailed,
	fetchReferenceDataByKeySearch,
	fetchReferenceDataByKeySearchFailed,
	fetchReferenceDataByKeySearchSuccess,
	fetchReferenceDataByKeySuccess,
	fetchReferenceDataFailed,
	fetchReferenceDataSuccess,
	fetchTyreReferenceDataByKeySearch,
	fetchTyreReferenceDataByKeySearchFailed,
	fetchTyreReferenceDataByKeySearchSuccess,
} from './reference-data.actions';

@Injectable()
export class ReferenceDataEffects {
	private actions$ = inject(Actions);
	private referenceDataService = inject(ReferenceDataService);
	private store = inject<Store<State>>(Store);

	fetchReferenceDataByType$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchReferenceData),
			mergeMap(({ resourceType, paginationToken }) =>
				this.referenceDataService.fetchReferenceData(resourceType, paginationToken).pipe(
					handleNotFound(resourceType),
					sortReferenceData(resourceType),
					switchMap((data) => {
						if (isPaginated(data)) {
							return of(
								fetchReferenceDataSuccess({
									resourceType,
									payload: data.data as ReferenceDataModelBase[],
									paginated: true,
								}),
								fetchReferenceData({ resourceType, paginationToken: data.paginationToken })
							);
						}
						return of(
							fetchReferenceDataSuccess({
								resourceType,
								payload: data.data as ReferenceDataModelBase[],
								paginated: false,
							})
						);
					}),
					catchError((e) => of(fetchReferenceDataFailed({ error: e.message, resourceType })))
				)
			)
		)
	);

	fetchReferenceDataByAuditType$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchReferenceDataAudit),
			mergeMap(({ resourceType, paginationToken }) =>
				this.referenceDataService.fetchReferenceDataAudit(resourceType, paginationToken).pipe(
					handleNotFound(resourceType),
					sortReferenceData(resourceType),
					switchMap((data) => {
						if (isPaginated(data)) {
							return of(
								fetchReferenceDataAuditSuccess({
									resourceType,
									payload: data.data as ReferenceDataModelBase[],
									paginated: true,
								}),
								fetchReferenceDataAudit({ resourceType, paginationToken: data.paginationToken })
							);
						}
						return of(
							fetchReferenceDataAuditSuccess({
								resourceType,
								payload: data.data as ReferenceDataModelBase[],
								paginated: false,
							})
						);
					}),
					catchError((e) => of(fetchReferenceDataAuditFailed({ error: e.message, resourceType })))
				)
			)
		)
	);

	fetchReferenceDataByKey$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchReferenceDataByKey),
			mergeMap(({ resourceType, resourceKey }) =>
				this.referenceDataService.fetchReferenceDataByKey(resourceType, resourceKey).pipe(
					handleNotFound(resourceType, resourceKey),
					map((data) =>
						fetchReferenceDataByKeySuccess({ resourceType, resourceKey, payload: data as ReferenceDataModelBase })
					),
					catchError((e) => of(fetchReferenceDataByKeyFailed({ error: e.message, resourceType })))
				)
			)
		)
	);

	fetchReferenceDataByKeySearch$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchReferenceDataByKeySearch),
			mergeMap(({ resourceType, resourceKey }) =>
				this.referenceDataService.fetchReferenceDataByKeySearch(resourceType, resourceKey).pipe(
					map((data) =>
						fetchReferenceDataByKeySearchSuccess({
							resourceType,
							resourceKey,
							payload: data.data as ReferenceDataModelBase[],
						})
					),
					catchError((e) => of(fetchReferenceDataByKeySearchFailed({ error: e.message, resourceType })))
				)
			)
		)
	);

	fetchTyreReferenceDataByKeySearch$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchTyreReferenceDataByKeySearch),
			mergeMap(({ searchFilter, searchTerm }) =>
				this.referenceDataService.fetchTyreReferenceDataByKeySearch(searchFilter, searchTerm).pipe(
					map((data) =>
						fetchTyreReferenceDataByKeySearchSuccess({
							resourceType: ReferenceDataResourceType.Tyres,
							payload: data.data as ReferenceDataModelBase[],
						})
					),
					catchError((e) =>
						of(
							fetchTyreReferenceDataByKeySearchFailed({
								error: e.message,
								resourceType: ReferenceDataResourceType.Tyres,
							})
						)
					)
				)
			)
		)
	);

	fetchReasonsForAbandoning = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchReasonsForAbandoning),
			mergeMap(() => this.store.pipe(select(testResultInEdit), take(1))),
			map((testResult) => {
				switch (testResult?.vehicleType) {
					case VehicleTypes.PSV:
						return fetchReferenceData({ resourceType: ReferenceDataResourceType.ReasonsForAbandoningPsv });
					case VehicleTypes.HGV:
						return fetchReferenceData({ resourceType: ReferenceDataResourceType.ReasonsForAbandoningHgv });
					case VehicleTypes.TRL:
						return fetchReferenceData({ resourceType: ReferenceDataResourceType.ReasonsForAbandoningTrl });
					default:
						throw new Error('Unexpected vehicle type');
				}
			})
		)
	);

	createReferenceDataItem$ = createEffect(() =>
		this.actions$.pipe(
			ofType(createReferenceDataItem),
			switchMap(({ resourceType, resourceKey, payload }) => {
				payload = { ...payload };
				return this.referenceDataService.createReferenceDataItem(resourceType, resourceKey, payload).pipe(
					map((result) => createReferenceDataItemSuccess({ result: result as ReferenceDataModelBase })),
					catchError((error) => of(createReferenceDataItemFailure({ error: error.message })))
				);
			})
		)
	);

	// The amend effect will work when the referenceData.service.ts is amended on line 395 from <EmptyObject> to <any>

	amendReferenceDataItem$ = createEffect(() =>
		this.actions$.pipe(
			ofType(amendReferenceDataItem),
			switchMap(({ resourceType, resourceKey, payload }) => {
				payload = { ...payload };
				return this.referenceDataService.amendReferenceDataItem(resourceType, resourceKey, payload).pipe(
					map((result) => amendReferenceDataItemSuccess({ result: result as ReferenceDataModelBase })),
					catchError((error) => of(amendReferenceDataItemFailure({ error: error.message })))
				);
			})
		)
	);

	deleteReferenceDataItem$ = createEffect(() =>
		this.actions$.pipe(
			ofType(deleteReferenceDataItem),
			switchMap(({ resourceType, resourceKey, reason }) => {
				const payload = { reason };
				return this.referenceDataService.deleteReferenceDataItem(resourceType, resourceKey, payload).pipe(
					map(() => deleteReferenceDataItemSuccess({ resourceType, resourceKey })),
					catchError((error) => of(deleteReferenceDataItemFailure({ error: error.message })))
				);
			})
		)
	);
}

function isPaginated(
	referenceDataApiResponse: ReferenceDataApiResponse
): referenceDataApiResponse is ReferenceDataApiResponseWithPagination {
	return Object.prototype.hasOwnProperty.call(referenceDataApiResponse, 'paginationToken');
}
