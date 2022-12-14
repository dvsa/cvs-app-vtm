import { ReferenceDataApiResponse, ReferenceDataItem } from '@api/reference-data';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Observable } from 'rxjs';

/**
 * handles response from reference data API to throw an error if not found i.e. response is a success with empty objects or no data.
 * @param args - lookup properties used by the API. will be used to construct error message when not found.
 * @returns emitted source value or error if response is equivalent to not found.
 */
export function handleNotFound(...args: any[]) {
  return function <T>(source: Observable<T>): Observable<T> {
    const isEmpty = (val: any) => !Object.keys(val).length || (val.hasOwnProperty('data') && !val.data.length);
    return new Observable(subscriber => {
      source.subscribe({
        next: val => {
          if (val && isEmpty(val)) {
            subscriber.error(new Error(`Reference data not found for resource type ${args}`));
          }

          subscriber.next(val);
        },
        error: e => subscriber.error(e),
        complete: () => subscriber.complete()
      });
    });
  };
}

export function sortReferenceData(resourceType: ReferenceDataResourceType) {
  return function (source: Observable<ReferenceDataApiResponse>): Observable<ReferenceDataApiResponse> {
    return new Observable(subscriber => {
      source.subscribe({
        next: val => {
          const { data } = val;
          subscriber.next({ ...val, data: _sort(resourceType, data) });
        },
        error: e => subscriber.error(e),
        complete: () => subscriber.complete()
      });
    });
  };
}

function _sort(type: ReferenceDataResourceType, data: ReferenceDataItem[]) {
  const _data = [...(data as ReferenceData[])];
  switch (type) {
    case ReferenceDataResourceType.User:
      return _data.sort(sorter('name'));
    default:
      return _data;
  }
}

type ReferenceData = ReferenceDataItem & Record<string, string | number>;
function sorter(sortkey: keyof ReferenceData | undefined = 'description') {
  const compare = (a: any, b: any) => (typeof a === 'string' ? (a <= b ? (a < b ? -1 : 0) : 1) : a - b);
  return (a: ReferenceData, b: ReferenceData) => {
    let l, r;
    if (sortkey && a.hasOwnProperty(sortkey)) {
      l = a[sortkey];
      r = b[sortkey];
    }

    return compare(l, r);
  };
}
