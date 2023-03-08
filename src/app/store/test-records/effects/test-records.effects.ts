import { Injectable } from '@angular/core';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { TEST_TYPES } from '@forms/models/testTypeId.enum';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { contingencyTestTemplates } from '@forms/templates/test-records/create-master.template';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TypeOfTest } from '@models/test-results/typeOfTest.enum';
import { TestStationType } from '@models/test-stations/test-station-type.enum';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { UserService } from '@services/user-service/user-service';
import { State } from '@store/.';
import { selectQueryParam, selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { updateResultOfTest } from '@store/test-records';
import { getTestStationFromProperty } from '@store/test-stations';
import { selectTestType } from '@store/test-types/selectors/test-types.selectors';
import merge from 'lodash.merge';
import { catchError, concatMap, map, mergeMap, of, switchMap, take, withLatestFrom } from 'rxjs';
import {
  contingencyTestTypeSelected,
  createTestResult,
  createTestResultFailed,
  createTestResultSuccess,
  editingTestResult,
  fetchSelectedTestResult,
  fetchSelectedTestResultFailed,
  fetchSelectedTestResultSuccess,
  fetchTestResultsBySystemNumber,
  fetchTestResultsBySystemNumberFailed,
  fetchTestResultsBySystemNumberSuccess,
  templateSectionsChanged,
  testTypeIdChanged,
  updateTestResult,
  updateTestResultFailed,
  updateTestResultSuccess
} from '../actions/test-records.actions';
import { selectedTestResultState, testResultInEdit } from '../selectors/test-records.selectors';

@Injectable()
export class TestResultsEffects {
  fetchTestResultsBySystemNumber$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchTestResultsBySystemNumber),
      mergeMap(({ systemNumber }) =>
        this.testRecordsService.fetchTestResultbySystemNumber(systemNumber, { fromDateTime: new Date(1970) }).pipe(
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
        return this.testRecordsService
          .fetchTestResultbySystemNumber(systemNumber, { fromDateTime: new Date(1970), testResultId, version: 'all' })
          .pipe(
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
          withLatestFrom(this.userService.name$, this.userService.id$, this.userService.userEmail$, this.store.pipe(select(selectRouteNestedParams))),
          take(1)
        )
      ),
      mergeMap(([testResult, name, id, userEmail, { systemNumber }]) => {
        return this.testRecordsService.saveTestResult(systemNumber, { name, id, userEmail }, testResult).pipe(
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
            } else if (e.status === 502) {
              validationsErrors.push({ error: 'Internal Server Error, please contact technical support', anchorLink: '' });
            }
            return of(updateTestResultFailed({ errors: validationsErrors }));
          })
        );
      })
    )
  );

  generateSectionTemplatesAndtestResultToUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(editingTestResult, testTypeIdChanged),
      mergeMap(action =>
        of(action).pipe(withLatestFrom(this.store.pipe(select(selectedTestResultState)), this.store.pipe(select(selectQueryParam('edit')))), take(1))
      ),
      concatMap(([action, selectedTestResult, isEditing]) => {
        const { testTypeId } = action;

        const { vehicleType } = selectedTestResult!;
        if (!vehicleType || !masterTpl.hasOwnProperty(vehicleType)) {
          return of(templateSectionsChanged({ sectionTemplates: [], sectionsValue: undefined }));
        }
        const testTypeGroup = TestRecordsService.getTestTypeGroup(testTypeId);
        const vehicleTpl = masterTpl[vehicleType];

        let tpl;
        if (testTypeGroup && vehicleTpl.hasOwnProperty(testTypeGroup)) {
          tpl = vehicleTpl[testTypeGroup as keyof typeof TEST_TYPES];
        } else {
          if (isEditing === 'true') {
            tpl = undefined;
          } else {
            tpl = vehicleTpl['default'];
          }
        }

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

        return of(
          templateSectionsChanged({ sectionTemplates: Object.values(tpl), sectionsValue: mergedForms as TestResultModel }),
          updateResultOfTest()
        );
      })
    )
  );

  generateContingencyTestTemplatesAndtestResultToUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(contingencyTestTypeSelected),
      mergeMap(action =>
        of(action).pipe(
          withLatestFrom(
            this.store.select(testResultInEdit),
            this.store.select(selectTestType(action.testType)),
            this.store.select(getTestStationFromProperty('testStationType', TestStationType.HQ)),
            this.userService.user$
          ),
          take(1)
        )
      ),
      concatMap(([action, editingTestResult, testTypeTaxonomy, testStation, user]) => {
        const id = action.testType;

        const { vehicleType } = editingTestResult!;
        if (!vehicleType || !contingencyTestTemplates.hasOwnProperty(vehicleType)) {
          return of(templateSectionsChanged({ sectionTemplates: [], sectionsValue: undefined }));
        }

        const testTypeGroup = TestRecordsService.getTestTypeGroup(id);
        const vehicleTpl = contingencyTestTemplates[vehicleType];

        const tpl =
          testTypeGroup && vehicleTpl.hasOwnProperty(testTypeGroup) ? vehicleTpl[testTypeGroup as keyof typeof TEST_TYPES] : vehicleTpl['default'];

        const mergedForms = {} as TestResultModel;
        Object.values(tpl!).forEach(node => {
          const form = this.dfs.createForm(node, editingTestResult);
          merge(mergedForms, form.getCleanValue(form));
        });

        mergedForms.testTypes[0].testTypeId = id;
        mergedForms.testTypes[0].name = testTypeTaxonomy?.name ?? '';
        mergedForms.testTypes[0].testTypeName = testTypeTaxonomy?.testTypeName ?? '';
        mergedForms.typeOfTest = (testTypeTaxonomy?.typeOfTest as TypeOfTest) ?? TypeOfTest.CONTINGENCY;

        const now = new Date().toISOString();

        if (mergedForms.typeOfTest !== TypeOfTest.CONTINGENCY) {
          mergedForms.testerName = user.name;
          mergedForms.testerEmailAddress = user.userEmail;
          mergedForms.testerStaffId = user.oid;
          mergedForms.testStartTimestamp = now;
          mergedForms.testEndTimestamp = now;
          mergedForms.testTypes[0].testTypeStartTimestamp = now;
          mergedForms.testTypes[0].testTypeEndTimestamp = now;
          mergedForms.testStationName = testStation?.testStationName ?? '[INVALID_OPTION]';
          mergedForms.testStationPNumber = testStation?.testStationPNumber ?? '[INVALID_OPTION]';
          mergedForms.testStationType = TestStationType.ATF;
        }

        return of(templateSectionsChanged({ sectionTemplates: Object.values(tpl!), sectionsValue: mergedForms }));
      })
    )
  );

  /**
   * Call POST Test Results API to update test result
   */
  createTestResult$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createTestResult),
      switchMap(action => {
        const testResult = action.value;
        return this.testRecordsService.postTestResult(testResult).pipe(
          take(1),
          map(() => createTestResultSuccess({ payload: { id: testResult.testResultId, changes: testResult } })),
          catchError(e => {
            const validationsErrors: GlobalError[] = [];
            if (e.status === 400) {
              const {
                error: { errors }
              } = e;
              Array.isArray(errors)
                ? errors.forEach((error: string) => {
                    const field = error.match(/"([^"]+)"/);
                    validationsErrors.push({ error, anchorLink: field && field.length > 1 ? field[1].replace('"', '') : '' });
                  })
                : validationsErrors.push({ error: e.error });
            } else if (e.status === 502) {
              validationsErrors.push({ error: 'Internal Server Error, please contact technical support', anchorLink: '' });
            }
            return of(createTestResultFailed({ errors: validationsErrors }));
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private testRecordsService: TestRecordsService,
    private store: Store<State>,
    private userService: UserService,
    private dfs: DynamicFormService
  ) {}
}
