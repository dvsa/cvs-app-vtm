import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { INITIAL_STATE, Store } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { TestRecordContainer } from '@app/test-record/test-record.container';
import { SharedModule } from '@app/shared/shared.module';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { TestRecordMapper, TestTypesApplicable } from '@app/test-record/test-record.mapper';
import { TestRecordTestType } from '@app/models/test-record-test-type';
import { IAppState } from '@app/store/state/app.state';
import { VIEW_STATE } from '@app/app.enums';
import { TestResultTestTypeNumber } from '@app/models/test-result-test-type-number';
import { TestResultModel } from '@app/models/test-result.model';

describe('TestRecordContainer', () => {
  let container: TestRecordContainer;
  let fixture: ComponentFixture<TestRecordContainer>;
  let store: Store<IAppState>;
  const testRecordTestType = {} as TestRecordTestType;
  const testResultTestTypeNumber: TestResultTestTypeNumber = {
    testResultUpdated: testRecordTestType.testRecord,
    testTypeNumber: '1'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
      providers: [
        TestRecordMapper,
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', { a: INITIAL_STATE })),
            select: jest.fn()
          }
        },
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
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(TestRecordContainer);
    container = fixture.componentInstance;
    container.testRecordObservable$ = of(testRecordTestType);
    container.testTypesApplicable = {} as TestTypesApplicable;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(container).toBeTruthy();
  });

  it('should set form state', () => {
    container.setFormState(true);
    expect(container.isFormDirty).toBeTruthy();
  });

  it('should dispatch action to set form state', () => {
    container.currentStateHandler(VIEW_STATE.VIEW_ONLY);
    expect(store.dispatch).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith({
      editState: 0,
      type: '[TestResultComponent] SetCurrentState'
    });
  });

  it('should submit test result data', () => {
    container.onTestSubmit({} as TestResultModel);
    expect(store.dispatch).toHaveBeenCalled();

    expect(store.dispatch).toHaveBeenCalledWith({
      testResultTestTypeNumber: {
        testResultUpdated: {},
        testTypeNumber: 'W01A34247'
      },
      type: '[UpdateTestResult] Update Test Result'
    });
  });

  // describe('canDeactivate', () => {
  //   it('return true if component can be deactivated ', () => {
  //     expect(container.canDeactivate()).toEqual(true);
  //   });
  //   it('return false if component can not be deactivated', () => {
  //     container.isFormDirty = true;
  //     expect(container.canDeactivate()).toEqual(false);
  //   });
  // });
});
