import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { TestRecordComponent } from './test-record.component';
import { INITIAL_STATE, Store } from '@ngrx/store';
import { IAppState } from '@app/store/state/app.state';
import { hot } from 'jasmine-marbles';
import { SharedModule } from '@app/shared/shared.module';
import { TestType } from '@app/models/test.type';
import { TestResultModel } from '@app/models/test-result.model';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange, SimpleChanges } from '@angular/core';
import { TestRecordTestType } from '@app/models/test-record-test-type';
import { FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TestRecordMapper, TestTypesApplicable } from '@app/test-record/test-record.mapper';
import { VIEW_STATE } from '@app/app.enums';
import { Preparer } from '@app/models/preparer';
import { TestStation } from '@app/models/test-station';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';

describe('TestRecordComponent', () => {
  let component: TestRecordComponent;
  let fixture: ComponentFixture<TestRecordComponent>;
  let store: Store<IAppState>;
  let injector: TestBed;
  let location;
  let changes: SimpleChanges;
  let dialog: MatDialog;
  let testRecordMapper;
  const testRecord = { vehicleType: 'psv' } as TestResultModel;
  const testType = {} as TestType;
  const testObject: TestRecordTestType = { testRecord: testRecord, testType: testType };
  const testResultParentForm = new FormGroup({ testType: new FormGroup({}) });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, ReactiveFormsModule, MatDialogModule],
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
    location = TestBed.get(Location);
    injector = getTestBed();
    dialog = injector.get(MatDialog);
    testRecordMapper = TestBed.get(TestRecordMapper);
    component = fixture.componentInstance;
    component.testResultObj = testObject;
    component.testTypesApplicable = {} as TestTypesApplicable;
    component.editState = VIEW_STATE.VIEW_ONLY;
    component.preparers = [{} as Preparer];
    component.testStations = [{} as TestStation];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('test ngOnInit()', () => {
    spyOn(component, 'onFormChanges');
    component.ngOnInit();
    expect(component.onFormChanges).toHaveBeenCalled();
  });

  it('test ngOnChanges()', () => {
    component.ngOnChanges(changes);
    fixture.detectChanges();
    expect(component.testResultObj).toEqual({} as TestRecordTestType);
  });

  it('should switch current state to view', () => {
    spyOn(component.switchState, 'emit');
    component.switchCurrentState('view', false);
    expect(component.switchState.emit).toHaveBeenCalled();
    expect(component.switchState.emit).toHaveBeenCalledWith(VIEW_STATE.VIEW_ONLY);
  });

  it('should switch current state to edit', () => {
    spyOn(component.switchState, 'emit');
    spyOn(location, 'back');
    component.switchCurrentState('edit', true);
    expect(component.switchState.emit).toHaveBeenCalled();
    expect(location.back).toHaveBeenCalled();
    expect(component.switchState.emit).toHaveBeenCalledWith(VIEW_STATE.EDIT);
  });

  it('should emit on form changes', () => {
    spyOn(component.isFormDirty, 'emit');
    component.onFormChanges();

    component.testResultParentForm.valueChanges.subscribe(() => {
      expect(component.isFormDirty.emit).toHaveBeenCalled();
    });

    expect(component.testResultObj).toEqual(testObject);
  });
});
