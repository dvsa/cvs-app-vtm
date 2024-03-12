import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DefectsService } from '@services/defects/defects.service';
import {
  catchError, iif, map, mergeMap, of,
} from 'rxjs';
import {
  fetchDefect,
  fetchDefectFailed,
  fetchDefectSuccess,
  fetchDefects,
  fetchDefectsFailed,
  fetchDefectsSuccess,
  setDefectsLoading,
} from '../actions/defects.actions';

@Injectable()
export class DefectsEffects {
  fetchDefectsRequest$ = () => this.defectsService.fetchDefects().pipe(
    map((defects) => fetchDefectsSuccess({ payload: defects })),
    catchError((e) => of(fetchDefectsFailed({ error: e.message }))),
  );

  fetchDefects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchDefects),
      mergeMap(() =>
        iif(
          () =>
            this.defectsService.cacheBucket.has(this.defectsService.getFetchDefectsCacheKey()),
          of(setDefectsLoading({ loading: false })),
          this.fetchDefectsRequest$(),
        )),
    ));

  fetchDefectRequest$ = (id: number) => this.defectsService.fetchDefect(id).pipe(
    map((defect) => fetchDefectSuccess({ id, payload: defect })),
    catchError((e) => of(fetchDefectFailed({ error: e.message }))),
  );

  fetchDefect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchDefect),
      mergeMap(({ id }) =>
        iif(
          () =>
            this.defectsService.cacheBucket.has(this.defectsService.getFetchDefectCacheKey(id)),
          of(setDefectsLoading({ loading: false })),
          this.fetchDefectRequest$(id),
        )),
    ));

  constructor(private actions$: Actions, private defectsService: DefectsService) {}
}
