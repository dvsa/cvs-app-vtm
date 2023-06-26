import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { ReferenceDataModelBase, ReferenceDataResourceType, ReferenceDataResourceTypeAudit } from '@models/reference-data.model';
import { select, Store } from '@ngrx/store';
import { State } from '@store/index';
import {
  fetchReferenceData,
  fetchReferenceDataByKey,
  fetchReferenceDataByKeySearch,
  selectReferenceDataByResourceKey,
  selectSearchReturn
} from '@store/reference-data';
import { it } from 'node:test';
import { combineLatest, map, Observable, of, skip, skipUntil, skipWhile, Subject, take, takeUntil, withLatestFrom } from 'rxjs';

@Pipe({
  name: 'refDataDecode$'
})
export class RefDataDecodePipe implements PipeTransform, OnDestroy {
  data: any;
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

    this.store.dispatch(fetchReferenceData({ resourceType: resourceType as ReferenceDataResourceType }));
    this.store.dispatch(fetchReferenceDataByKeySearch({ resourceType: (resourceType + '#AUDIT') as ReferenceDataResourceType, resourceKey: value }));

    return combineLatest([
      this.store.select(selectReferenceDataByResourceKey(resourceType as ReferenceDataResourceType, value)),
      this.store.select(selectSearchReturn((resourceType + '#AUDIT') as ReferenceDataResourceTypeAudit))
    ]).pipe(
      skipWhile(([_, refDataItemAuditSelector]) => refDataItemAuditSelector === undefined),
      map(([refDataItem, refDataItemAudit]) => {
        if (!refDataItem) {
          return refDataItemAudit?.[0].description ?? value;
        }
        return refDataItem[decodeKey as keyof ReferenceDataModelBase] ?? value;
      })
    );
  }
}
