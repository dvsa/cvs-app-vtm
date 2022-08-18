import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TestTypesService } from '@services/test-types/test-types.service';
import { catchError, switchMap, map, of } from 'rxjs';
import { fetchTestTypes, fetchTestTypesFailed, fetchTestTypesSuccess } from '../actions/test-types.actions';

@Injectable()
export class TestTypeEffects {
  fetchTestTypeTaxonomy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchTestTypes),
      switchMap(() =>
        this.testTypeService.getTestTypes().pipe(
          map(testTypes => fetchTestTypesSuccess({ payload: testTypes })),
          catchError(e => of(fetchTestTypesFailed({ error: e.message })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private testTypeService: TestTypesService) {}
}
