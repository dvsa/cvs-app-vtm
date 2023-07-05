import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { SpecialRefData } from '@forms/services/multi-options.service';
import { ReferenceDataModelBase, ReferenceDataResourceType, ReferenceDataResourceTypeAudit } from '@models/reference-data.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { State } from '@store/index';
import { fetchReferenceData, fetchReferenceDataByKeySearch, selectReferenceDataByResourceKey, selectSearchReturn } from '@store/reference-data';
import { selectVehicleType } from '@store/technical-records/selectors/batch-create.selectors';
import { Observable, Subject, combineLatest, map, of } from 'rxjs';

@Pipe({
  name: 'refDataDecode$'
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

    if (resourceType === SpecialRefData.ReasonsForAbandoning) {
      const type = this.store.select(selectVehicleType);
      switch (type) {
        case of(VehicleTypes.HGV):
          resourceType = ReferenceDataResourceType.ReasonsForAbandoningHgv;
          break;
        case of(VehicleTypes.PSV):
          resourceType = ReferenceDataResourceType.ReasonsForAbandoningHgv;
          break;
        case of(VehicleTypes.TRL):
          resourceType = ReferenceDataResourceType.ReasonsForAbandoningTrl;
          break;
        default:
          resourceType = ReferenceDataResourceType.ReasonsForAbandoningHgv;
          break;
      }
    }

    this.store.dispatch(fetchReferenceData({ resourceType: resourceType as ReferenceDataResourceType }));
    this.store.dispatch(
      fetchReferenceDataByKeySearch({ resourceType: (resourceType + '#AUDIT') as ReferenceDataResourceType, resourceKey: value + '#' })
    );

    return combineLatest([
      this.store.select(selectReferenceDataByResourceKey(resourceType as ReferenceDataResourceType, value)),
      this.store.select(selectSearchReturn((resourceType + '#AUDIT') as ReferenceDataResourceTypeAudit))
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
