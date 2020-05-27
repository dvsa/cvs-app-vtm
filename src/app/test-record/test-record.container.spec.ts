import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { TestRecordContainer } from '@app/test-record/test-record.container';
import { SharedModule } from '@app/shared/shared.module';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { TestRecordMapper, TestTypesApplicable } from '@app/test-record/test-record.mapper';
import { TestRecordTestType } from '@app/models/test-record-test-type';
import { VIEW_STATE } from '@app/app.enums';
import { TestResultTestTypeNumber } from '@app/models/test-result-test-type-number';
import { TestResultModel } from '@app/models/test-result.model';
import { EVehicleTestResultModelActions } from '@app/store/actions/VehicleTestResultModel.actions';
import { Preparer } from '@app/models/preparer';
import { TestStation } from '@app/models/test-station';
import { TESTING_TEST_MODELS_UTILS } from '@app/utils/testing-test-models.utils';
import { MockStore } from '@app/utils/mockStore';
import {getTestViewState} from '@app/store/selectors/VehicleTestResultModel.selectors';

const mockSelector = new BehaviorSubject<any>(undefined);

describe('TestRecordContainer', () => {
  let container: TestRecordContainer;
  let fixture: ComponentFixture<TestRecordContainer>;
  const store: MockStore = new MockStore(mockSelector);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
      providers: [
        TestRecordMapper,
        { provide: Store, useValue: store },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ id: 'W01A34247' }),
            paramMap: of(convertToParamMap({ id: 'W01A34247' }))
          }
        }
      ],
      declarations: [TestRecordContainer],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    jest.spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(TestRecordContainer);
    container = fixture.componentInstance;
    container.testTypesApplicable = {} as TestTypesApplicable;
    fixture.detectChanges();
  });

  it('should create', () => {
    mockSelector.next({
      selectTestTypeById: {
        testType: TESTING_TEST_MODELS_UTILS.mockTestType(),
        testRecord: TESTING_TEST_MODELS_UTILS.mockTestRecord()
      },
      getPreparers: { preparerName: 'test' } as Preparer,
      getTestStations: { testStationName: 'test' } as TestStation,
      getTestViewState: VIEW_STATE.VIEW_ONLY
    });

    expect(container).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch action to set form state', () => {
    container.currentStateHandler(VIEW_STATE.VIEW_ONLY);
    expect(store.dispatch).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith({
      editState: VIEW_STATE.VIEW_ONLY,
      type: EVehicleTestResultModelActions.SetTestViewState
    });
  });

  it('should submit test result data', () => {
    container.onTestSubmit({} as TestResultModel);
    expect(store.dispatch).toHaveBeenCalled();

    expect(store.dispatch).toHaveBeenCalledWith({
      testResultTestTypeNumber: {
        testResultUpdated: {},
        testTypeNumber: 'W01A34247',
        testResultsUpdated: {}
      },
      type: EVehicleTestResultModelActions.UpdateTestResult
    });
  });
});

@Component({
  selector: 'vtm-test-record',
  template: `
    <div>Test result object: {{ testResultObj | json }}</div>
    <div>Current state: {{ editState ? 'EDIT' : 'VIEW ONLY' }}</div>
    <div>Preparers: {{ preparers }}</div>
    <div>Test stations: {{ testStations }}</div>
  `
})
export class TestingTestRecordComponent {
  @Input() editState: VIEW_STATE;
  @Input() preparers: Preparer[];
  @Input() testResultObj: TestRecordTestType;
  @Input() testStations: TestStation[];
  @Input() testTypesApplicable: TestTypesApplicable;
  @Output() submitTest = new EventEmitter<TestResultModel>();
  @Output() switchState = new EventEmitter<VIEW_STATE>();
  @Output() isFormDirty = new EventEmitter<boolean>();
}
