import { Injectable } from '@angular/core';
import {
  CreateTestResult,
  CreateTestResultSuccess,
  DownloadCertificate,
  EVehicleTestResultActions,
  GetVehicleTestResultModel,
  GetVehicleTestResultModelFailure,
  GetVehicleTestResultModelSuccess,
  SetTestViewState,
  UpdateSelectedTestResultModel,
  UpdateSelectedTestResultModelSuccess,
  UpdateTestResult,
  UpdateTestResultSuccess
} from '@app/store/actions/VehicleTestResult.actions';
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
import {
  getSelectedVehicleTestResultModel,
  getVehicleTestResultModel
} from '@app/store/selectors/VehicleTestResult.selectors';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { getRouterParams } from '@app/store/selectors/route.selectors';
import { getSelectedVehicleTechRecord } from '@app/store/selectors/VehicleTechRecordModel.selectors';

@Injectable()
export class VehicleTestResultEffects {
  @Effect()
  getTestResults$: Observable<Action> = this._actions$.pipe(
    ofType<GetVehicleTestResultModel>(EVehicleTestResultActions.GetVehicleTestResultModel),
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
    ofType<UpdateTestResult>(EVehicleTestResultActions.UpdateTestResult),
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
            const errorMessage = !!error ? error.errors : [''];
            return [new SetErrorMessage(errorMessage)];
          })
        );
    })
  );

  @Effect({ dispatch: false })
  downloadCertificate$ = this._actions$.pipe(
    ofType<DownloadCertificate>(EVehicleTestResultActions.DownloadCertificate),
    map((action) => action.payload),
    switchMap((fileName: string) => {
      return this._testResultService.downloadCertificate(fileName).pipe(
        switchMap((response: ArrayBuffer) => {
          const documentBlob = new Blob([response], { type: 'application/octet-stream' });
          FileSaver.saveAs(documentBlob, fileName, { autoBom: false });
          return of(undefined);
        }),
        catchError((error) => {
          const errorMsg = `A digital certificate could not be found for this test.
            Try resaving this test record to generate a new certificate or manually issue a copy using the information on this page.`;

          this._store.dispatch(new SetErrorMessage([errorMsg]));
          return of(undefined);
        })
      );
    })
  );

  @Effect()
  updateSelectedTestResult$ = this._actions$.pipe(
    ofType<UpdateSelectedTestResultModel>(
      EVehicleTestResultActions.UpdateSelectedTestResultModel
    ),
    withLatestFrom(
      this._store.select(getSelectedVehicleTestResultModel),
      this._store.select(getRouterParams)
    ),
    map(([{ payload }, selectedTestResult, routeParams]) => {
      return {
        payload,
        selectedTestResult,
        routeParams
      };
    }),
    switchMap((params) => {
      let updatedTestRecord: TestResultModel;
      const { payload, selectedTestResult, routeParams } = params;

      updatedTestRecord = this.updateTestTypeInTestRecord(
        selectedTestResult,
        routeParams.params.id,
        payload
      );

      this.router.navigate(['/test-record', routeParams.params.id], {
        queryParams: {
          testResultId: selectedTestResult.testResultId,
          systemNumber: selectedTestResult.systemNumber
        }
      });

      return [new UpdateSelectedTestResultModelSuccess(updatedTestRecord)];
    })
  );

  @Effect()
  createTestRecord$ = this._actions$.pipe(
    ofType<CreateTestResult>(EVehicleTestResultActions.CreateTestResult),
    withLatestFrom(this._store.select(getSelectedVehicleTechRecord)),
    map(([{ vTestResultUpdated }, selectedRecord]) => {
      return { vTestResultUpdated, selectedRecord };
    }),
    switchMap((params) => {
      const { vTestResultUpdated, selectedRecord } = params;
      let testResult;
      testResult = {
        msUserDetails: { ...this.loggedUser.getUser() },
        vin: selectedRecord.vin,
        trailerId: selectedRecord.trailerId,
        systemNumber: selectedRecord.systemNumber,
        ...vTestResultUpdated
      };

      this.router.navigate(['/test-record'], {
        queryParams: {
          testResultId: vTestResultUpdated.testResultId,
          systemNumber: selectedRecord.systemNumber
        }
      });

      return [
        new CreateTestResultSuccess(vTestResultUpdated),
        new SetTestViewState(VIEW_STATE.EDIT)
      ];
    })
  );

  constructor(
    private _testResultService: TestResultService,
    private _store: Store<IAppState>,
    private _actions$: Actions,
    private loggedUser: UserService,
    private router: Router
  ) {}

  updateTestResultsInState(
    testResultsInState: TestResultModel[],
    testResultTestTypeNumberObject: TestResultTestTypeNumber
  ): TestResultModel[] {
    return !!testResultsInState
      ? testResultsInState.map((testResult) => {
          if (
            testResult.testTypes.some(
              (testType) => testType.testNumber === testResultTestTypeNumberObject.testTypeNumber
            )
          ) {
            return testResultTestTypeNumberObject.testResultUpdated;
          } else {
            return testResult;
          }
        })
      : [{} as TestResultModel];
  }

  updateTestTypeInTestRecord(
    selectedTestResult: TestResultModel,
    testNumber,
    treeData
  ): TestResultModel {
    selectedTestResult.testTypes.forEach((tType, index) => {
      if (tType.testNumber === testNumber) {
        const testType = selectedTestResult.testTypes[index];
        testType.testTypeId = !!treeData ? treeData.key : testType.testTypeId;
        testType.testTypeName = !!treeData ? treeData.value : testType.testTypeName;
      }
    });
    return selectedTestResult;
  }
}
