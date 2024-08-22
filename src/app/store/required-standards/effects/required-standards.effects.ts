import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RequiredStandardsService } from '@services/required-standards/required-standards.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import {
	getRequiredStandards,
	getRequiredStandardsFailure,
	getRequiredStandardsSuccess,
} from '../actions/required-standards.actions';

@Injectable()
export class RequiredStandardsEffects {
	private actions$ = inject(Actions);
	private requiredStandardsService = inject(RequiredStandardsService);

	getRequiredStandards$ = createEffect(() =>
		this.actions$.pipe(
			ofType(getRequiredStandards),
			mergeMap(({ euVehicleCategory }) =>
				this.requiredStandardsService.getRequiredStandards(euVehicleCategory).pipe(
					map((requiredStandards) => getRequiredStandardsSuccess({ requiredStandards })),
					catchError((e) => of(getRequiredStandardsFailure({ error: e.message })))
				)
			)
		)
	);
}
