import { Injectable, inject } from '@angular/core';
import { Roles } from '@models/roles.enum';
import { TypeOfTest } from '@models/test-results/typeOfTest.enum';
import { HttpCacheManager } from '@ngneat/cashew';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { HttpService } from '@services/http/http.service';
import { UserService } from '@services/user-service/user-service';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { CacheKeys } from '../../models/cache-keys.enum';
import {
	fetchTestTypes,
	fetchTestTypesComplete,
	fetchTestTypesFailed,
	fetchTestTypesSuccess,
} from './test-types.actions';

@Injectable()
export class TestTypeEffects {
	private store = inject(Store);
	private cacheManager = inject(HttpCacheManager);
	private actions$ = inject(Actions);
	private httpService = inject(HttpService);
	private userService = inject(UserService);

	fetchTestTypeTaxonomy$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchTestTypes),
			tap(() => {
				if (this.cacheManager.has(CacheKeys.TEST_TYPES)) {
					this.store.dispatch(fetchTestTypesComplete());
				}
			}),
			filter(() => !this.cacheManager.has(CacheKeys.TEST_TYPES)),
			switchMap(() => this.userService.roles$),
			switchMap((roles) => {
				const typeOfTest = Roles.TestResultCreateDeskAssessment.split(',').some((role) => roles?.includes(role))
					? TypeOfTest.DESK_BASED
					: undefined;

				return this.httpService.getTestTypes(typeOfTest).pipe(
					map((testTypes) => fetchTestTypesSuccess({ payload: testTypes })),
					catchError((e) => of(fetchTestTypesFailed({ error: e.message })))
				);
			})
		)
	);
}
