import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpService } from '@services/http/http.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import {
	fetchDefect,
	fetchDefectFailed,
	fetchDefectSuccess,
	fetchDefects,
	fetchDefectsFailed,
	fetchDefectsSuccess,
} from './defects.actions';

@Injectable()
export class DefectsEffects {
	private actions$ = inject(Actions);
	private httpService = inject(HttpService);

	fetchDefects$ = createEffect(() =>
		this.actions$.pipe(
			ofType(fetchDefects),
			mergeMap(() =>
				this.httpService.fetchDefects().pipe(
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
				this.httpService.fetchDefect(id).pipe(
					map((defect) => fetchDefectSuccess({ id, payload: defect })),
					catchError((e) => of(fetchDefectFailed({ error: e.message })))
				)
			)
		)
	);
}
