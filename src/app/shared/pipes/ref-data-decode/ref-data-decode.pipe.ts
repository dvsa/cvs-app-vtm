import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { SpecialRefData } from '@forms/services/multi-options.service';
import {
	ReferenceDataModelBase,
	ReferenceDataResourceType,
	ReferenceDataResourceTypeAudit,
} from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { State } from '@store/index';
import {
	fetchReferenceData,
	fetchReferenceDataByKeySearch,
	selectReferenceDataByResourceKey,
	selectSearchReturn,
} from '@store/reference-data';
import { getSingleVehicleType } from '@store/technical-records';
import { Observable, Subject, asapScheduler, combineLatest, map, of, take } from 'rxjs';

@Pipe({
	name: 'refDataDecode$',
})
export class RefDataDecodePipe implements PipeTransform, OnDestroy {
	constructor(private store: Store<State>) {}

	private destroy$ = new Subject<void>();

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	transform(
		value: string | number | undefined,
		resourceType: string | undefined,
		decodeKey: string | number = 'description'
	): Observable<string | number | undefined> {
		if (!resourceType || !value) {
			return of(value);
		}

		let calculatedResourceType = resourceType;

		if (calculatedResourceType === SpecialRefData.ReasonsForAbandoning) {
			this.store
				.select(getSingleVehicleType)
				.pipe(take(1))
				.subscribe((vehicleType) => {
					switch (vehicleType) {
						case VehicleTypes.HGV:
							calculatedResourceType = ReferenceDataResourceType.ReasonsForAbandoningHgv;
							break;
						case VehicleTypes.PSV:
							calculatedResourceType = ReferenceDataResourceType.ReasonsForAbandoningPsv;
							break;
						case VehicleTypes.TRL:
							calculatedResourceType = ReferenceDataResourceType.ReasonsForAbandoningTrl;
							break;
						default:
							calculatedResourceType = ReferenceDataResourceType.ReasonsForAbandoningHgv;
							break;
					}
				});
		}

		asapScheduler.schedule(() => {
			this.store.dispatch(fetchReferenceData({ resourceType: calculatedResourceType as ReferenceDataResourceType }));
		});

		asapScheduler.schedule(() => {
			this.store.dispatch(
				fetchReferenceDataByKeySearch({
					resourceType: `${calculatedResourceType}#AUDIT` as ReferenceDataResourceType,
					resourceKey: `${value}#`,
				})
			);
		});

		return combineLatest([
			this.store.select(selectReferenceDataByResourceKey(calculatedResourceType as ReferenceDataResourceType, value)),
			this.store.select(selectSearchReturn(`${calculatedResourceType}#AUDIT` as ReferenceDataResourceTypeAudit)),
		]).pipe(
			map(([refDataItem, refDataItemAudit]) => {
				if (!refDataItem) {
					return refDataItemAudit?.[0].description ?? value;
				}
				return refDataItem[decodeKey as keyof ReferenceDataModelBase] ?? value;
			})
		);
	}
}
