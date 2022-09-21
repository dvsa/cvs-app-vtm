import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { CustomFormControl, FormNodeTypes, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { mockTestResult } from '@mocks/mock-test-result';
import { TestStation } from '@models/test-stations/test-station.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState, State } from '@store/.';
import { sectionTemplates, testResultInEdit } from '@store/test-records';
import { initialTestStationsState } from '@store/test-stations';
import { firstValueFrom, Observable } from 'rxjs';
import { CustomAsyncValidators } from './custom-async-validators';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

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
            testStations: { ...initialTestStationsState, ids: ['1'], entities: { ['1']: { testStationName: 'foo', testStationPNumber: '1234', testStationType: 'bar' } } }
          }
        })
      ]
    });

    store = TestBed.inject(MockStore);

    form = new FormGroup({
      testStationName: new CustomFormControl({ name: 'testStationName', type: FormNodeTypes.CONTROL, children: [] }, null),
      testStationType: new CustomFormControl({ name: 'testStationType', type: FormNodeTypes.CONTROL, children: [] }, null),
      testStationPNumber: new CustomFormControl({ name: 'testStationPNumber', type: FormNodeTypes.CONTROL, children: [] }, null),
    });
  });
  it('should update the test stations details', async () => {
    form.controls['testStationPNumber'].patchValue('1234');
    expect(form.controls['testStationPNumber']).toBeTruthy();
    await firstValueFrom(CustomAsyncValidators.updateTestStationDetails(store)(form.controls['testStationPNumber']) as Observable<null>);
    expect(form.controls['testStationType'].value).toBe('bar')
    expect(form.controls['testStationName'].value).toBe('foo')
  });
});

describe('testAndSwitchToHiddenFieldWithDefectTaxonomy', () => {
  let form: FormGroup;
  let store: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: initialAppState })]
    });

    store = TestBed.inject(MockStore);

    form = new FormGroup({
      testResult: new CustomFormControl({ name: 'testResult', type: FormNodeTypes.CONTROL, editType: FormNodeEditTypes.RADIO, children: [] }, null,null)
    });
  });

  it('should show testResult chooser when defects section is not present', async () => {
    store.overrideSelector(testResultInEdit, mockTestResult());
    store.overrideSelector(sectionTemplates, Object.values(masterTpl.psv['testTypesGroup15And16']));

    const result = await firstValueFrom(
      CustomAsyncValidators.testAndSwitchToHiddenFieldWithDefectTaxonomy(store)(form.controls['testResult']) as Observable<ValidationErrors | null>
    );
    
    expect((form.controls['testResult'] as CustomFormControl).meta.editType).toBe(FormNodeEditTypes.RADIO)
  });

  it('should hide testResult chooser when defects section is present', async () => {

    store.overrideSelector(testResultInEdit, mockTestResult());
    store.overrideSelector(sectionTemplates, Object.values(masterTpl.psv['testTypesGroup1']));

    const result = await firstValueFrom(
      CustomAsyncValidators.testAndSwitchToHiddenFieldWithDefectTaxonomy(store)(form.controls['testResult']) as Observable<ValidationErrors | null>
    );

    expect((form.controls['testResult'] as CustomFormControl).meta.editType).toBe(FormNodeEditTypes.HIDDEN)
  });

});

