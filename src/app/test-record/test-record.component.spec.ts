import {async, ComponentFixture, getTestBed, TestBed} from '@angular/core/testing';
import {TestRecordComponent} from './test-record.component';
import {INITIAL_STATE, Store} from '@ngrx/store';
import {IAppState} from '@app/store/state/app.state';
import {hot} from 'jasmine-marbles';
import {SharedModule} from '@app/shared/shared.module';
import {TestType} from '@app/models/test.type';
import {TestResultModel} from '@app/models/test-result.model';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {SpyLocation} from '@angular/common/testing';
import {Location} from '@angular/common';

describe('TestRecordComponent', () => {
  let component: TestRecordComponent;
  let fixture: ComponentFixture<TestRecordComponent>;
  let store: Store<IAppState>;
  let injector: TestBed;
  const testType = {} as TestType;
  const testRecord =  {vehicleType: 'psv' } as TestResultModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule ],
      declarations: [TestRecordComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', {a: INITIAL_STATE})),
            select: jest.fn()
          }
        },
        { provide: Location, useClass: SpyLocation }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(TestRecordComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    component.testTypeNumber = 'W01A34247';
    component.testType = testType;
    component.testRecord = testRecord;
    component.seatBeltApplicable = ['11'];
    component.emissionDetailsApplicable = ['22'];
    component.defectsApplicable = ['33'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
