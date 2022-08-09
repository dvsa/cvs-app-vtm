import { Injectable } from '@angular/core';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { TEST_TYPES } from '@forms/models/testTypeId.enum';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { TestResultModel } from '@models/test-result.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { UserService } from '@services/user-service/user-service';
import { State } from '@store/.';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import merge from 'lodash.merge';
import { catchError, concatMap, exhaustMap, filter, map, mergeMap, of, skip, take, withLatestFrom } from 'rxjs';
import {
  fetchSelectedTestResult,
  fetchSelectedTestResultFailed,
  fetchSelectedTestResultSuccess,
  fetchTestResultsBySystemNumber,
  fetchTestResultsBySystemNumberFailed,
  fetchTestResultsBySystemNumberSuccess,
  updateTestResult,
  updateTestResultFailed,
  updateTestResultSuccess,
  editingTestResult,
  templateSectionsChanged,
  updateEditingTestResult
} from '../actions/test-records.actions';
import { selectedTestResultState } from '../selectors/test-records.selectors';

@Injectable()
export class TestResultsEffects {
  fetchTestResultsBySystemNumber$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchTestResultsBySystemNumber),
      mergeMap(({ systemNumber }) =>
        this.testRecordsService.fetchTestResultbySystemNumber(systemNumber).pipe(
          map(testResults => fetchTestResultsBySystemNumberSuccess({ payload: testResults })),
          catchError(e => {
            switch (e.status) {
              case 404:
                return of(fetchTestResultsBySystemNumberSuccess({ payload: [] as TestResultModel[] }));
            }
            return of(fetchTestResultsBySystemNumberFailed({ error: e.message }));
          })
        )
      )
    )
  );

  fetchSelectedTestResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchSelectedTestResult),
      mergeMap(() => this.store.pipe(select(selectRouteNestedParams), take(1))),
      mergeMap(params => {
        const { systemNumber, testResultId } = params;
        return this.testRecordsService.fetchTestResultbySystemNumber(systemNumber, { testResultId, version: 'all' }).pipe(
          map(vehicleTestRecords => {
            if (vehicleTestRecords && vehicleTestRecords.length === 1) {
              return fetchSelectedTestResultSuccess({ payload: vehicleTestRecords[0] });
            } else {
              return fetchSelectedTestResultFailed({ error: 'Test result not found' });
            }
          }),
          catchError(e => {
            return of(fetchSelectedTestResultFailed({ error: e.message }));
          })
        );
      })
    )
  );

  /**
   * Call PUT Test Results API to update test result
   */
  updateTestResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTestResult),
      mergeMap(action =>
        of(action.value).pipe(
          withLatestFrom(this.userService.userName$, this.userService.id$, this.routerService.getRouteParam$('systemNumber')),
          take(1)
        )
      ),
      mergeMap(([testResult, username, id, systemNumber]) => {
        return this.testRecordsService.saveTestResult(systemNumber!, { username, id }, testResult).pipe(
          take(1),
          map(responseBody => updateTestResultSuccess({ payload: { id: responseBody.testResultId, changes: responseBody } })),
          catchError(e => {
            const validationsErrors: GlobalError[] = [];
            if (e.status === 400) {
              const {
                error: { errors }
              } = e;
              errors.forEach((error: string) => {
                const field = error.match(/"([^"]+)"/);
                validationsErrors.push({ error, anchorLink: field && field.length > 1 ? field[1].replace('"', '') : '' });
              });
            }
            return of(updateTestResultFailed({ errors: validationsErrors }));
          })
        );
      })
    )
  );

  generateSectionTemplatesAndtestResultToUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(editingTestResult, updateEditingTestResult),
      concatLatestFrom(action => this.store.pipe(select(selectedTestResultState))),
      filter(([action, selectedTestResult]) => {
        const { testResult, type } = action;

        return (
          type === editingTestResult.type || (type === updateEditingTestResult.type && testResult.testTypes && !!testResult.testTypes[0].testTypeId)
        );
      }),
      concatMap(([action, selectedTestResult]) => {
        const { testResult } = action;
        if (!testResult) {
          return of(templateSectionsChanged({ sectionTemplates: [], sectionsValue: undefined }));
        }

        const { vehicleType } = testResult;
        if (!vehicleType || !masterTpl.hasOwnProperty(vehicleType) || testResult.testTypes.length == 0) {
          return of(templateSectionsChanged({ sectionTemplates: [], sectionsValue: undefined }));
        }
        const testTypeId = testResult.testTypes[0].testTypeId;
        const testTypeGroup = this.getTestTypeGroup(testTypeId);
        const vehicleTpl = masterTpl[vehicleType as VehicleTypes];
        const tpl = testTypeGroup && vehicleTpl.hasOwnProperty(testTypeGroup) ? vehicleTpl[testTypeGroup] : undefined;

        if (!tpl) {
          return of(templateSectionsChanged({ sectionTemplates: [], sectionsValue: undefined }));
        }

        const mergedForms = {};
        Object.values(tpl).forEach(node => {
          const form = this.dfs.createForm(node, selectedTestResult);
          merge(mergedForms, form.getCleanValue(form));
        });

        if (testTypeId) {
          (mergedForms as TestResultModel).testTypes[0].testTypeId = testTypeId;
        }

        return of(templateSectionsChanged({ sectionTemplates: tpl ? Object.values(tpl) : [], sectionsValue: mergedForms as TestResultModel }));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private testRecordsService: TestRecordsService,
    private store: Store<State>,
    private userService: UserService,
    private routerService: RouterService,
    private dfs: DynamicFormService
  ) {}

  getTestTypeGroup(testTypeId: string): string | undefined {
    for (const groupName in TEST_TYPES) {
      if (TEST_TYPES[groupName as keyof typeof TEST_TYPES].includes(testTypeId)) {
        return groupName;
      }
    }
    return undefined;
  }
}
