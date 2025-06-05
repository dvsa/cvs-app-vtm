import { OnDestroy, Pipe, PipeTransform, inject } from '@angular/core';
import {
	ReferenceDataModelBase,
	ReferenceDataResourceType,
	ReferenceDataResourceTypeAudit,
} from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { SpecialRefData } from '@services/multi-options/multi-options.service';
import {
	fetchReferenceData,
	fetchReferenceDataByKeySearch,
	selectReferenceDataByResourceKey,
	selectSearchReturn,
} from '@store/reference-data';
import { getSingleVehicleType } from '@store/technical-records';
import { Observable, Subject, asapScheduler, combineLatest, map, of, take } from 'rxjs';

@Pipe({ name: 'refDataDecode$' })
export class RefDataDecodePipe implements PipeTransform, OnDestroy {
	store = inject(Store);

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

		if (resourceType === SpecialRefData.ReasonsForAbandoning) {
			this.store
				.select(getSingleVehicleType)
				.pipe(take(1))
				.subscribe((vehicleType) => {
					switch (vehicleType) {
						case VehicleTypes.HGV:
							resourceType = ReferenceDataResourceType.ReasonsForAbandoningHgv;
							break;
						case VehicleTypes.PSV:
							resourceType = ReferenceDataResourceType.ReasonsForAbandoningPsv;
							break;
						case VehicleTypes.TRL:
							resourceType = ReferenceDataResourceType.ReasonsForAbandoningTrl;
							break;
						default:
							resourceType = ReferenceDataResourceType.ReasonsForAbandoningHgv;
							break;
					}
				});
		}

		asapScheduler.schedule(() => {
			this.store.dispatch(fetchReferenceData({ resourceType: resourceType as ReferenceDataResourceType }));
		});

		asapScheduler.schedule(() => {
			this.store.dispatch(
				fetchReferenceDataByKeySearch({
					resourceType: `${resourceType}#AUDIT` as ReferenceDataResourceType,
					resourceKey: `${value}#`,
				})
			);
		});

		return combineLatest([
			this.store.select(selectReferenceDataByResourceKey(resourceType as ReferenceDataResourceType, value)),
			this.store.select(selectSearchReturn(`${resourceType}#AUDIT` as ReferenceDataResourceTypeAudit)),
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
