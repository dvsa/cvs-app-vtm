import { Injectable } from '@angular/core';
import { Roles } from '@models/roles.enum';
import { TypeOfTest } from '@models/test-results/typeOfTest.enum';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TestTypesService } from '@services/test-types/test-types.service';
import { UserService } from '@services/user-service/user-service';
import { catchError, switchMap, map, of } from 'rxjs';
import { fetchTestTypes, fetchTestTypesFailed, fetchTestTypesSuccess } from '../actions/test-types.actions';

@Injectable()
export class TestTypeEffects {
  fetchTestTypeTaxonomy$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchTestTypes),
      switchMap(() => this.userService.roles$),
      switchMap(roles => {
        const typeOfTest = roles?.includes(Roles.TestResultCreateDeskAssesment) ? TypeOfTest.DESK_BASED : undefined;

        return this.testTypeService.getTestTypes(typeOfTest).pipe(
          map(testTypes => fetchTestTypesSuccess({ payload: testTypes })),
          catchError(e => of(fetchTestTypesFailed({ error: e.message })))
        );
      })
    )
  );

  constructor(private actions$: Actions, private testTypeService: TestTypesService, private userService: UserService) {}
}
