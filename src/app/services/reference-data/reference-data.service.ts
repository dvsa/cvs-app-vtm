import { Injectable, inject } from '@angular/core';
import { MultiOptions } from '@forms/models/options.model';
import {
	ReferenceDataModelBase,
	ReferenceDataResourceType,
	ReferenceDataTyre,
	User,
} from '@models/reference-data.model';
import { ReferenceDataApiResponse, ReferenceDataItemApiResponse } from '@models/reference-data/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store, select } from '@ngrx/store';
import { HttpService } from '@services/http/http.service';
import { UserService } from '@services/user-service/user-service';
import {
	ReferenceDataEntityStateSearch,
	addSearchInformation,
	fetchReferenceData,
	fetchReferenceDataByKey,
	fetchReferenceDataByKeySearch,
	fetchTyreReferenceDataByKeySearch,
	referencePsvMakeLoadingState,
	removeReferenceDataByKey,
	removeTyreSearch,
	selectAllReferenceDataByResourceType,
	selectReasonsForAbandoning,
	selectReferenceDataByResourceKey,
	selectSearchReturn,
	selectTyreSearchCriteria,
} from '@store/reference-data';
import { Observable, of, switchMap, throwError, withLatestFrom } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ReferenceDataService {
	store = inject(Store);
	httpService = inject(HttpService);
	usersService = inject(UserService);

	//  URL to POST new reference data items: /reference/{ type capitalized }/{ new key } POST
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	createReferenceDataItem(type: ReferenceDataResourceType, key: string, data: any) {
		return this.usersService.id$.pipe(
			withLatestFrom(this.usersService.name$),
			switchMap(([createdId, createdName]) => {
				return this.httpService.referenceResourceTypeResourceKeyPost(type, key, {
					...data,
					createdId,
					createdName,
					createdAt: new Date(),
				});
			})
		);
	}

	//  URL to PUT new reference data items: /reference/{ type capitalized }/{ new key } PUT
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	amendReferenceDataItem(type: ReferenceDataResourceType, key: string, data: any) {
		return this.usersService.id$.pipe(
			withLatestFrom(this.usersService.name$),
			switchMap(([createdId, createdName]) => {
				return this.httpService.referenceResourceTypeResourceKeyPut(type, key, {
					...data,
					createdId,
					createdName,
					createdAt: new Date(),
				});
			})
		);
	}

	deleteReferenceDataItem(type: ReferenceDataResourceType, key: string, payload: Record<string, unknown>) {
		return this.usersService.id$.pipe(
			withLatestFrom(this.usersService.name$),
			switchMap(([createdId, createdName]) => {
				return this.httpService.referenceResourceTypeResourceKeyDelete(type, key, {
					...payload,
					createdId,
					createdName,
					createdAt: new Date(),
				});
			})
		);
	}

	fetchReferenceData(
		resourceType: ReferenceDataResourceType,
		paginationToken?: string
	): Observable<ReferenceDataApiResponse> {
		if (!resourceType) {
			return throwError(() => new Error('Reference data resourceType is required'));
		}

		return this.httpService.referenceResourceTypeGet(resourceType, paginationToken);
	}

	fetchReferenceDataAudit(
		resourceType: ReferenceDataResourceType,
		paginationToken?: string
	): Observable<ReferenceDataApiResponse> {
		if (!resourceType) {
			return throwError(() => new Error('Reference data resourceType is required'));
		}

		return this.httpService.referenceResourceTypeGet(resourceType, paginationToken);
	}

	fetchReferenceDataByKey(
		resourceType: ReferenceDataResourceType,
		resourceKey: string | number
	): Observable<ReferenceDataItemApiResponse> {
		return this.httpService.referenceResourceTypeResourceKeyGet(resourceType, resourceKey);
	}

	loadReferenceDataByKey(resourceType: ReferenceDataResourceType, resourceKey: string | number): void {
		return this.store.dispatch(fetchReferenceDataByKey({ resourceType, resourceKey }));
	}

	fetchReferenceDataByKeySearch(
		resourceType: ReferenceDataResourceType,
		resourceKey: string | number
	): Observable<ReferenceDataApiResponse> {
		return this.httpService.referenceLookupResourceTypeResourceKeyGet(resourceType, resourceKey);
	}

	fetchTyreReferenceDataByKeySearch(searchFilter: string, searchTerm: string): Observable<ReferenceDataApiResponse> {
		return this.httpService.referenceLookupTyresSearchKeyParamGet(searchFilter, searchTerm);
	}

	loadReferenceDataByKeySearch(resourceType: ReferenceDataResourceType, resourceKey: string | number): void {
		this.store.dispatch(fetchReferenceDataByKeySearch({ resourceType, resourceKey }));
	}

	loadTyreReferenceDataByKeySearch(searchFilter: string, searchTerm: string): void {
		this.store.dispatch(fetchTyreReferenceDataByKeySearch({ searchFilter, searchTerm }));
	}

	loadReferenceData(resourceType: ReferenceDataResourceType): void {
		this.store.dispatch(fetchReferenceData({ resourceType }));
	}

	removeReferenceDataByKey(resourceType: ReferenceDataResourceType, resourceKey: string): void {
		this.store.dispatch(removeReferenceDataByKey({ resourceType, resourceKey }));
	}

	addSearchInformation(filter: string, term: string): void {
		this.store.dispatch(addSearchInformation({ filter, term }));
	}

	removeTyreSearch(): void {
		this.store.dispatch(removeTyreSearch());
	}

	getTyreSearchReturn$(): Observable<ReferenceDataTyre[] | null> {
		return this.store.pipe(select(selectSearchReturn(ReferenceDataResourceType.Tyres))) as Observable<
			ReferenceDataTyre[] | null
		>;
	}

	getTyreSearchCriteria$(): Observable<ReferenceDataEntityStateSearch> {
		return this.store.pipe(select(selectTyreSearchCriteria));
	}

	getAll$(resourceType: ReferenceDataResourceType): Observable<ReferenceDataModelBase[] | undefined> {
		return this.store.pipe(select(selectAllReferenceDataByResourceType(resourceType)));
	}

	getByKey$(resourceType: ReferenceDataResourceType, resourceKey: string | number) {
		return this.store.pipe(select(selectReferenceDataByResourceKey(resourceType, resourceKey)));
	}

	getReferenceDataOptions(resourceType: ReferenceDataResourceType): Observable<MultiOptions | undefined> {
		return this.getAll$(resourceType).pipe((source) => this.mapReferenceDataOptions(source));
	}

	private mapReferenceDataOptions(
		source: Observable<Array<ReferenceDataModelBase & Partial<User>> | undefined>
	): Observable<MultiOptions | undefined> {
		return new Observable((subscriber) => {
			source.subscribe({
				next: (val) => {
					subscriber.next(
						val?.map((option) => ({
							value: option.resourceKey,
							label: option.description ?? option.name ?? `${option.resourceKey}`,
						}))
					);
				},
				error: (e) => subscriber.error(e),
				complete: () => subscriber.complete(),
			});
		});
	}

	getReasonsForAbandoning(vehicleType: VehicleTypes | undefined): Observable<MultiOptions | undefined> {
		if (!vehicleType) {
			return of([]);
		}
		return this.store.pipe(select(selectReasonsForAbandoning(vehicleType)), (source) =>
			this.mapReferenceDataOptions(source)
		);
	}

	getReferencePsvMakeDataLoading$(): Observable<boolean> {
		return this.store.pipe(select(referencePsvMakeLoadingState));
	}
}
