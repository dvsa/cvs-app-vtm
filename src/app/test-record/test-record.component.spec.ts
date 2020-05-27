import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { TestRecordComponent } from './test-record.component';
import { INITIAL_STATE, Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { hot } from 'jasmine-marbles';
import { SharedModule } from '@app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestRecordTestType } from '@app/models/test-record-test-type';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TestRecordMapper, TestTypesApplicable } from '@app/test-record/test-record.mapper';
import { VIEW_STATE } from '@app/app.enums';
import { Preparer } from '@app/models/preparer';
import { TestStation } from '@app/models/test-station';
import { SpyLocation } from '@angular/common/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TESTING_TEST_MODELS_UTILS } from '@app/utils/testing-test-models.utils';
import { Location } from '@angular/common';

describe('TestRecordComponent', () => {
  let component: TestRecordComponent;
  let fixture: ComponentFixture<TestRecordComponent>;
  let store: Store<IAppState>;
  let injector: TestBed;
  let dialog: MatDialog;
  let testRecordMapper;
  const testObject: TestRecordTestType = {
    testRecord: TESTING_TEST_MODELS_UTILS.mockTestRecord(),
    testType: TESTING_TEST_MODELS_UTILS.mockTestType()
  };
  const testResultParentForm = new FormGroup({
    testTypes: new FormGroup({ testTypeId: new FormControl('1') })
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, ReactiveFormsModule, MatDialogModule, BrowserAnimationsModule],
      declarations: [TestRecordComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        TestRecordMapper,
        FormGroupDirective,
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', { a: INITIAL_STATE })),
            select: jest.fn()
          }
        },
        { provide: Location, useClass: SpyLocation }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(TestRecordComponent);
    injector = getTestBed();
    dialog = injector.get(MatDialog);
    testRecordMapper = TestBed.get(TestRecordMapper);
    component = fixture.componentInstance;
    component.testResultObj = testObject;
    component.testTypesApplicable = {
      seatBeltApplicable: testRecordMapper.getTestTypeApplicable('seatBeltApplicable'),
      defectsApplicable: testRecordMapper.getTestTypeApplicable('defectsApplicable'),
      emissionDetailsApplicable: testRecordMapper.getTestTypeApplicable(
        'emissionDetailsApplicable'
      ),
      testSectionApplicable1: testRecordMapper.getTestTypeApplicable('testSectionApplicable1'),
      testSectionApplicable2: testRecordMapper.getTestTypeApplicable('testSectionApplicable2')
    };
    component.editState = VIEW_STATE.VIEW_ONLY;
    component.preparers = [{ preparerName: 'test', preparerId: '11' } as Preparer];
    component.testStations = [{ testStationPNumber: '22' } as TestStation];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('should switch current state to edit', () => {
    spyOn(component.switchState, 'emit');
    component.switchCurrentState('edit');
    expect(component.switchState.emit).toHaveBeenCalledWith(VIEW_STATE.EDIT);
  });

  it('should make the call to save test results', () => {
    const formRawValue = testResultParentForm.getRawValue();
    component.onSaveTestResult(testResultParentForm);
    expect(formRawValue).toMatchObject({ testTypes: { testTypeId: '1' } });
  });

  it('should emit on download certificate', () => {
    spyOn(component.downloadCert, 'emit');
    component.downloadCertificate();

    component.testResultParentForm.valueChanges.subscribe(() => {
      expect(component.downloadCert.emit).toHaveBeenCalled();
    });

    expect(component.testResultObj).toEqual(testObject);
  });
});

