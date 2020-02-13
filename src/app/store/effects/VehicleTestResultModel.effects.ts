import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  EVehicleTestResultModelActions,
  GetVehicleTestResultModel,
  GetVehicleTestResultModelSuccess
} from '@app/store/actions/VehicleTestResultModel.actions';
import { TestResultService } from '@app/technical-record-search/test-result.service';
import { Store } from '@ngrx/store';
import { IAppState } from '../state/app.state';
import { ClearErrorMessage, SetErrorMessage } from '../actions/Error.actions';

@Injectable()
export class VehicleTestResultModelEffects {
  @Effect()
  getTestResults$ = this._actions$.pipe(
    ofType<GetVehicleTestResultModel>(EVehicleTestResultModelActions.GetVehicleTestResultModel),
    map(action => action.payload),
    switchMap((searchIdentifier: string) => this._testResultService.getTestResults(searchIdentifier)),
    switchMap((testResultJson: any) => { 
      this._store$.dispatch(new ClearErrorMessage())
      return of(new GetVehicleTestResultModelSuccess(testResultJson)) }),
    catchError((error) => of(this._store$.dispatch(new SetErrorMessage(error))))
  );

  constructor(
    private _testResultService: TestResultService,
    private _store$: Store<IAppState>,
    private _actions$: Actions) {
  }
}
