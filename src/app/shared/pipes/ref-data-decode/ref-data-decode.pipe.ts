import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { ReferenceDataModelBase, ReferenceDataResourceType } from '@models/reference-data.model';
import { Store } from '@ngrx/store';
import { State } from '@store/index';
import { fetchReferenceDataByKey, selectReferenceDataByResourceKey } from '@store/reference-data';
import { map, Observable, of, Subject, takeUntil } from 'rxjs';

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
    decodeKey: string = 'description'
  ): Observable<string | number | undefined> {
    if (!resourceType || !value) {
      return of(value);
    }

    this.store.dispatch(fetchReferenceDataByKey({ resourceType: resourceType as ReferenceDataResourceType, resourceKey: value }));

    return this.store.select(selectReferenceDataByResourceKey(resourceType as ReferenceDataResourceType, value)).pipe(
      takeUntil(this.destroy$),
      map(refDataItem => {
        if (!refDataItem) return value;

        return refDataItem[decodeKey as keyof ReferenceDataModelBase] ?? value;
      })
    );
  }
}
