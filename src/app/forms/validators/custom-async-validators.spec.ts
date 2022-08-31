import { TestBed } from '@angular/core/testing';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { CustomFormControl, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { mockTestResult } from '@mocks/mock-test-result';
import { TestStation } from '@models/test-stations/test-station.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { testResultInEdit } from '@store/test-records';
import { initialTestStationsState } from '@store/test-stations';
import { firstValueFrom, Observable } from 'rxjs';
import { CustomAsyncValidators } from './custom-async-validators';

describe('resultDependantOnCustomDefects', () => {
  let form: FormGroup;
  let store: MockStore<State>;

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

    const result = await firstValueFrom(
      CustomAsyncValidators.resultDependantOnCustomDefects(store)(form.controls['testResult']) as Observable<ValidationErrors | null>
    );

    expect(result).toEqual({ invalidTestResult: { message: 'Cannot pass test when defects are present' } });
  });

  it('should fail validation when value is "fail" but no defects are present', async () => {
    form.controls['testResult'].patchValue('fail');

    const testResult = mockTestResult();
    testResult.testTypes = [];

    store.overrideSelector(testResultInEdit, testResult);

    const result = await firstValueFrom(
      CustomAsyncValidators.resultDependantOnCustomDefects(store)(form.controls['testResult']) as Observable<ValidationErrors | null>
    );

    expect(result).toEqual({ invalidTestResult: { message: 'Cannot fail test when no defects are present' } });
  });

  it('should fail validation when value is "prs" but no defects are present', async () => {
    form.controls['testResult'].patchValue('prs');

    const testResult = mockTestResult();
    testResult.testTypes = [];

    store.overrideSelector(testResultInEdit, testResult);

    const result = await firstValueFrom(
      CustomAsyncValidators.resultDependantOnCustomDefects(store)(form.controls['testResult']) as Observable<ValidationErrors | null>
    );

    expect(result).toEqual({ invalidTestResult: { message: 'Cannot mark test as PRS when no defects are present' } });
  });

  it('should pass validation when value is "abandoned"', async () => {
    form.controls['testResult'].patchValue('abandoned');

    store.overrideSelector(testResultInEdit, mockTestResult());

    const result = await firstValueFrom(
      CustomAsyncValidators.resultDependantOnCustomDefects(store)(form.controls['testResult']) as Observable<ValidationErrors | null>
    );

    expect(result).toBeNull();
  });
});

describe('updateTestStationDetails', () => {
  let form: FormGroup;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({
          initialState: {
            ...initialAppState,
            testStations: { ...initialTestStationsState, ids: ['1'], entities: { ['1']: { testStationName: 'foo', testStationPNumber: '1234' } } }
          }
        })
      ]
    });

    store = TestBed.inject(MockStore);

    form = new FormGroup({
      testStationName: new CustomFormControl({ name: 'testStationName', type: FormNodeTypes.CONTROL, children: [] }, null)
    });
  });
  it('should dispatch the action to update the test stations details', async () => {
    form.controls['testStationName'].patchValue('foo');
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    expect(form.controls['testStationName']).toBeTruthy;
    await firstValueFrom(CustomAsyncValidators.updateTestStationDetails(store)(form.controls['testStationName']) as Observable<null>);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({
      payload: {
        testStationName: 'foo',
        testStationPNumber: '1234'
      },
      type: '[test-stations] update the test station'
    });
  });
});
