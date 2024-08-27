import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DefectsService } from '@services/defects/defects.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import {
	fetchDefect,
	fetchDefectFailed,
	fetchDefectSuccess,
	fetchDefects,
	fetchDefectsFailed,
	fetchDefectsSuccess,
} from '../actions/defects.actions';

@Injectable()
export class DefectsEffects {
	private actions$ = inject(Actions);
	private defectsService = inject(DefectsService);

	fetchDefects$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchDefects),
			mergeMap(() =>
				this.defectsService.fetchDefects().pipe(
					map((defects) => fetchDefectsSuccess({ payload: defects })),
					catchError((e) => of(fetchDefectsFailed({ error: e.message })))
				)
			)
		)
	);

	fetchDefect$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchDefect),
			mergeMap(({ id }) =>
				this.defectsService.fetchDefect(id).pipe(
					map((defect) => fetchDefectSuccess({ id, payload: defect })),
					catchError((e) => of(fetchDefectFailed({ error: e.message })))
				)
			)
		)
	);
}
