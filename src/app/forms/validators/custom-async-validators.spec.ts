import { TestBed } from '@angular/core/testing';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { mockTestResult } from '@mocks/mock-test-result';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import { testResultInEdit, TestResultsState } from '@store/test-records';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CustomAsyncValidators } from './custom-async-validators';

describe('resultDependantOnCustomDefects', () => {
  let form: FormGroup;
  let store: MockStore<TestResultsState>;;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: initialAppState })]
    });

    store = TestBed.inject(MockStore);

    form = new FormGroup({
      testResult: new CustomFormControl({ name: 'testResult', type: FormNodeTypes.CONTROL, children: [] }, null)
    });
  });

  it('should fail validation when value is "pass" and defects are present', async () => {
    form.controls['testResult'].patchValue('pass');

    store.overrideSelector(testResultInEdit, mockTestResult());

    const result = await firstEmitted(
      CustomAsyncValidators.resultDependantOnCustomDefects(store)(form.controls['testResult']) as Observable<ValidationErrors | null>
    );

    expect(result).toEqual({ invalidTestResult: { message: 'Cannot pass test when defects are present' } });
  });

  it('should fail validation when value is "fail" but no defects are present', async () => {
    form.controls['testResult'].patchValue('fail');

    const testResult = mockTestResult();
    testResult.testTypes = [];

    store.overrideSelector(testResultInEdit, testResult);

    const result = await firstEmitted(
      CustomAsyncValidators.resultDependantOnCustomDefects(store)(form.controls['testResult']) as Observable<ValidationErrors | null>
    );

    expect(result).toEqual({ invalidTestResult: { message: 'Cannot fail test when no defects are present' } });
  });

  it('should fail validation when value is "prs" but no defects are present', async () => {
    form.controls['testResult'].patchValue('prs');

    const testResult = mockTestResult();
    testResult.testTypes = [];

    store.overrideSelector(testResultInEdit, testResult);

    const result = await firstEmitted(
      CustomAsyncValidators.resultDependantOnCustomDefects(store)(form.controls['testResult']) as Observable<ValidationErrors | null>
    );

    expect(result).toEqual({ invalidTestResult: { message: 'Cannot mark test as PRS when no defects are present' } });
  });

  it('should pass validation when value is "abandoned"', async () => {
    form.controls['testResult'].patchValue('abandoned');

    store.overrideSelector(testResultInEdit, mockTestResult());

    const result = await firstEmitted(
      CustomAsyncValidators.resultDependantOnCustomDefects(store)(form.controls['testResult']) as Observable<ValidationErrors | null>
    );

    expect(result).toBeNull();
  });
});

function firstEmitted<T>(obs$: Observable<T>): Promise<T> {
  return new Promise<T>(resolve => {
      const finalise = new Subject<void>();
      obs$.pipe(takeUntil(finalise)).subscribe(value => {
          finalise.next();
          resolve(value);
      });
  });
}
