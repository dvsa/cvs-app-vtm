import { Injectable, inject } from '@angular/core';
import { Roles } from '@models/roles.enum';
import { TypeOfTest } from '@models/test-results/typeOfTest.enum';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpService } from '@services/http/http.service';
import { UserService } from '@services/user-service/user-service';
import { catchError, map, of, switchMap } from 'rxjs';
import { fetchTestTypes, fetchTestTypesFailed, fetchTestTypesSuccess } from './test-types.actions';

@Injectable()
export class TestTypeEffects {
	private actions$ = inject(Actions);
	private httpService = inject(HttpService);
	private userService = inject(UserService);

	fetchTestTypeTaxonomy$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchTestTypes),
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
