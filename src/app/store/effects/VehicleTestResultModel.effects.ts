import { Injectable } from '@angular/core';
import {
  EVehicleTestResultModelActions,
  GetVehicleTestResultModel,
  GetVehicleTestResultModelFailure,
  GetVehicleTestResultModelSuccess,
  SetTestViewState,
  UpdateTestResult,
  UpdateTestResultSuccess,
  DownloadCertificate
} from '@app/store/actions/VehicleTestResultModel.actions';
import { TestResultService } from '@app/technical-record-search/test-result.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { ClearErrorMessage, SetErrorMessage } from '../actions/Error.actions';
import { IAppState } from '../state/app.state';
import { TestResultModel } from '@app/models/test-result.model';
import { VehicleTestResultUpdate } from '@app/models/vehicle-test-result-update';
import { VIEW_STATE } from '@app/app.enums';
import { TestResultTestTypeNumber } from '@app/models/test-result-test-type-number';
import { UserService } from '@app/app-user.service';
import { getVehicleTestResultModel } from '@app/store/selectors/VehicleTestResultModel.selectors';
import * as FileSaver from 'file-saver';

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
          return [new GetVehicleTestResultModelFailure(error)];
        })
      )
    )
  );

  @Effect()
  updateTestResult$ = this._actions$.pipe(
    ofType<UpdateTestResult>(EVehicleTestResultModelActions.UpdateTestResult),
    withLatestFrom(this._store.select(getVehicleTestResultModel)),
    map(([{ testResultTestTypeNumber }, testResultsInState]): [
      TestResultTestTypeNumber,
      TestResultModel[]
    ] => [testResultTestTypeNumber, testResultsInState]),
    switchMap(([testResultTestTypeNumber, testResultsInState]) => {
      const testResultTestTypeNumberObject = testResultTestTypeNumber;
      let testResultObject: VehicleTestResultUpdate = {} as VehicleTestResultUpdate;
      const { testResultUpdated } = testResultTestTypeNumber;

      testResultObject = {
        msUserDetails: { ...this.loggedUser.getUser() },
        testResult: testResultUpdated
      };

      return this._testResultService
        .updateTestResults(testResultObject.testResult.systemNumber, testResultObject)
        .pipe(
          switchMap((testRecordResult) => {
            testResultTestTypeNumberObject.testResultUpdated = testRecordResult;
            testResultTestTypeNumberObject.testResultsUpdated = this.updateTestResultsInState(
              testResultsInState,
              testResultTestTypeNumberObject
            );
            return [
              new SetTestViewState(VIEW_STATE.VIEW_ONLY),
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

  @Effect()
  downloadCertificate$ = this._actions$.pipe(
    ofType<DownloadCertificate>(EVehicleTestResultModelActions.DownloadCertificate),
    map((action) => action.payload),
    switchMap((fileName: string) => {
      return this._testResultService.downloadCertificate(fileName).pipe(
        switchMap((documentBlob: string | Blob) => {
          FileSaver.saveAs(documentBlob, fileName);
          return of(undefined);
        }),
        catchError((error) => {
          const errorMsg = `A digital certificate could not be found for this test.
            Try resaving this test record to generate a new certificate or manually issue a copy using the information on this page.`;

          return of(new SetErrorMessage([errorMsg]));
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

  updateTestResultsInState(
    testResultsInState: TestResultModel[],
    testResultTestTypeNumberObject: TestResultTestTypeNumber
  ): TestResultModel[] {
    return testResultsInState.map((testResult) => {
      if (
        testResult.testTypes.some(
          (testType) => testType.testNumber === testResultTestTypeNumberObject.testTypeNumber
        )
      ) {
        return testResultTestTypeNumberObject.testResultUpdated;
      } else {
        return testResult;
      }
    });
  }
}
