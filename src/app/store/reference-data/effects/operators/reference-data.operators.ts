import { ReferenceDataApiResponse, ReferenceDataItem } from '@api/reference-data';
import { ReferenceDataResourceType } from '@models/reference-data.model';
import { Observable } from 'rxjs';

/**
 * handles response from reference data API to throw an error if not found i.e. response is a success with empty objects or no data.
 * @param args - lookup properties used by the API. will be used to construct error message when not found.
 * @returns emitted source value or error if response is equivalent to not found.
 */
export function handleNotFound(...args: unknown[]) {
	// eslint-disable-next-line func-names
	return <T>(source: Observable<T>): Observable<T> => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const isEmpty = (val: any) =>
			!Object.keys(val).length || (Object.prototype.hasOwnProperty.call(val, 'data') && !val.data.length);
		return new Observable((subscriber) => {
			source.subscribe({
				next: (val) => {
					if (val && isEmpty(val)) {
						// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
						subscriber.error(new Error(`Reference data not found for resource type ${args}`));
					}

					subscriber.next(val);
				},
				error: (e) => subscriber.error(e),
				complete: () => subscriber.complete(),
			});
		});
	};
}

export function sortReferenceData(resourceType: ReferenceDataResourceType) {
	// eslint-disable-next-line func-names
	return (source: Observable<ReferenceDataApiResponse>): Observable<ReferenceDataApiResponse> =>
		new Observable((subscriber) => {
			source.subscribe({
				next: (val) => {
					const { data } = val;
					subscriber.next({ ...val, data: _sort(resourceType, data) });
				},
				error: (e) => subscriber.error(e),
				complete: () => subscriber.complete(),
			});
		});
}

// eslint-disable-next-line no-underscore-dangle
function _sort(type: ReferenceDataResourceType, data: ReferenceDataItem[]) {
	const dataToSort = [...(data as ReferenceData[])];
	switch (type) {
		case ReferenceDataResourceType.User:
			return dataToSort.sort(sorter('name'));
		default:
			return dataToSort;
	}
}

type ReferenceData = ReferenceDataItem & Record<string, string | number>;
function sorter(sortkey: keyof ReferenceData | undefined = 'description') {
	// eslint-disable-next-line no-nested-ternary, @typescript-eslint/no-explicit-any
	const compare = (a: any, b: any) => (typeof a === 'string' ? (a <= b ? (a < b ? -1 : 0) : 1) : a - b);
	return (a: ReferenceData, b: ReferenceData) => {
		let l;
		let r;
		if (sortkey && Object.prototype.hasOwnProperty.call(a, sortkey)) {
			l = a[`${sortkey}`];
			r = b[`${sortkey}`];
		}

		return compare(l, r);
	};
}
