import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpService } from '@services/http/http.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import {
	getRequiredStandards,
	getRequiredStandardsFailure,
	getRequiredStandardsSuccess,
} from './required-standards.actions';

@Injectable()
export class RequiredStandardsEffects {
	private actions$ = inject(Actions);
	private httpService = inject(HttpService);

	getRequiredStandards$ = createEffect(() =>
		this.actions$.pipe(
			ofType(getRequiredStandards),
			mergeMap(({ euVehicleCategory }) =>
				this.httpService.fetchRequiredStandards(euVehicleCategory).pipe(
					map((requiredStandards) => getRequiredStandardsSuccess({ requiredStandards })),
					catchError((e) => of(getRequiredStandardsFailure({ error: e.message })))
				)
			)
		)
	);
}
