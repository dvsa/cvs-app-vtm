import { Injectable } from '@angular/core';
import {
  EVehicleTestResultModelActions,
  GetVehicleTestResultModel,
  GetVehicleTestResultModelFailure,
  GetVehicleTestResultModelSuccess,
  SetCurrentState,
  UpdateTestResult,
  UpdateTestResultSuccess
} from '@app/store/actions/VehicleTestResultModel.actions';
import { TestResultService } from '@app/technical-record-search/test-result.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ClearErrorMessage, SetErrorMessage } from '../actions/Error.actions';
import { IAppState } from '../state/app.state';
import { TestResultModel } from '@app/models/test-result.model';
import { VehicleTestResultUpdate } from '@app/models/vehicle-test-result-update';
import { VIEW_STATE } from '@app/app.enums';
import { TestResultTestTypeNumber } from '@app/models/test-result-test-type-number';
import { UserService } from '@app/app-user.service';

@Injectable()
export class VehicleTestResultModelEffects {
  @Effect()
  getTestResults$: Observable<Action> = this._actions$.pipe(
    ofType<GetVehicleTestResultModel>(EVehicleTestResultModelActions.GetVehicleTestResultModel),
    map((action) => action.payload),
    switchMap((searchIdentifier: string) =>
      this._testResultService.getTestResults(searchIdentifier).pipe(
        switchMap((testResults: TestResultModel[]) => {
          this._store.dispatch(new ClearErrorMessage());
          return of(new GetVehicleTestResultModelSuccess(testResults));
        }),
        catchError((error) => {
          return of(new GetVehicleTestResultModelFailure(error));
        })
      )
    )
  );

  @Effect()
  updateTestResult$ = this._actions$.pipe(
    ofType<UpdateTestResult>(EVehicleTestResultModelActions.UpdateTestResult),
    map(({ testResultTestTypeNumber }) => testResultTestTypeNumber),
    switchMap((testResultTestTypeNumber: TestResultTestTypeNumber) => {
      const testResultTestTypeNumberObject = testResultTestTypeNumber;
      let testResultObject: VehicleTestResultUpdate = {} as VehicleTestResultUpdate;
      const { testResultUpdated } = testResultTestTypeNumber;

      testResultObject = {
        msUserDetails: { ...this.loggedUser.getUser() },
        testResult: testResultUpdated
      };

      return this._testResultService
        .updateTestResults(
          testResultObject.testResult.systemNumber,
          testResultObject
        )
        .pipe(
          switchMap((testRecordResult) => {
            testResultTestTypeNumberObject.testResultUpdated = testRecordResult;
            return [
              new SetCurrentState(VIEW_STATE.VIEW_ONLY),
              new UpdateTestResultSuccess(testResultTestTypeNumberObject),
              new ClearErrorMessage()
            ];
          }),
          catchError(({ error }) => {
            const errorMessage = error.errors;
            return [new SetErrorMessage(errorMessage)];
          })
        );
    })
  );

  constructor(
    private _testResultService: TestResultService,
    private _store: Store<IAppState>,
    private _actions$: Actions,
    private loggedUser: UserService
  ) {}
}

