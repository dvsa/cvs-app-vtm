import { Injectable } from '@angular/core';
import {
  EVehicleTestResultModelActions,
  GetVehicleTestResultModel,
  GetVehicleTestResultModelFailure,
  GetVehicleTestResultModelSuccess
} from '@app/store/actions/VehicleTestResultModel.actions';
import { TestResultService } from '@app/technical-record-search/test-result.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ClearErrorMessage } from '../actions/Error.actions';
import { IAppState } from '../state/app.state';
import { TestResultModel } from '@app/models/test-result.model';

@Injectable()
export class VehicleTestResultModelEffects {
  @Effect()
  getTestResults$: Observable<Action> = this._actions$.pipe(
    ofType<GetVehicleTestResultModel>(EVehicleTestResultModelActions.GetVehicleTestResultModel),
    map((action) => action.payload),
    switchMap((searchIdentifier: string) =>
      this._testResultService.getTestResults(searchIdentifier).pipe(
        switchMap((testResultJson: TestResultModel) => {
          this._store$.dispatch(new ClearErrorMessage());
          return of(new GetVehicleTestResultModelSuccess(testResultJson));
        }),
        catchError((error) => {
          return of(new GetVehicleTestResultModelFailure(error));
        })
      )
    )
  );

  constructor(
    private _testResultService: TestResultService,
    private _store$: Store<IAppState>,
    private _actions$: Actions
  ) {}
}
