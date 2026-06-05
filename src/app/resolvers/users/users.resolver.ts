import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { ReferenceDataResourceType } from '../../models/reference-data.model';
import { fetchReferenceData, selectAllReferenceDataByResourceType } from '../../store/reference-data';

export const usersResolver: ResolveFn<boolean> = () => {
	const store = inject(Store);
	store.dispatch(fetchReferenceData({ resourceType: ReferenceDataResourceType.User }));

	return store
		.select(selectAllReferenceDataByResourceType(ReferenceDataResourceType.User))
		.pipe(map((users) => Boolean(users && users.length > 0)));
};
