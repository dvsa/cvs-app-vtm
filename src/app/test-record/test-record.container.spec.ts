import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { INITIAL_STATE, Store } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { TestRecordContainer } from '@app/test-record/test-record.container';
import { SharedModule } from '@app/shared/shared.module';
import { TestResultModel } from '@app/models/test-result.model';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { TestType } from '@app/models/test.type';
import { TestRecordMapper } from '@app/test-record/test-record.mapper';

describe('TestRecordContainer', () => {
  let container: TestRecordContainer;
  let fixture: ComponentFixture<TestRecordContainer>;
  const testRecord = {} as (TestType | TestResultModel)[];

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
    fixture = TestBed.createComponent(TestRecordContainer);
    container = fixture.componentInstance;
    container.testRecordObservable$ = of(testRecord);
    container.testTypeNumber = 'W01A34247';
    container.seatBeltApplicable = ['11'];
    container.emissionDetailsApplicable = ['22'];
    container.defectsApplicable = ['33'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(container).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
