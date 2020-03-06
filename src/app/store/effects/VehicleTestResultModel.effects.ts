import { Injectable } from '@angular/core';
import {
  EVehicleTestResultModelActions, GetVehicleTestResultModel, GetVehicleTestResultModelSuccess
} from '@app/store/actions/VehicleTestResultModel.actions';
import { TestResultService } from '@app/technical-record-search/test-result.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ClearErrorMessage } from '../actions/Error.actions';
import { IAppState } from '../state/app.state';

@Injectable()
export class VehicleTestResultModelEffects {
  @Effect()
  getTestResults$: Observable<Action> = this._actions$.pipe(
    ofType<GetVehicleTestResultModel>(EVehicleTestResultModelActions.GetVehicleTestResultModel),
    map(action => action.payload),
    switchMap((searchIdentifier: string) => this._testResultService.getTestResults(searchIdentifier)),
    switchMap((testResultJson: any) => {
      this._store$.dispatch(new ClearErrorMessage())
      return of(new GetVehicleTestResultModelSuccess(testResultJson))
    }),
  );

  constructor(
    private _testResultService: TestResultService,
    private _store$: Store<IAppState>,
    private _actions$: Actions) {
  }
}
