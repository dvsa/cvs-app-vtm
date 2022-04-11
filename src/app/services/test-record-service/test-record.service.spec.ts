import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { TestRecordService } from './test-record.service';
import { initialAppState } from '@store/.';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import * as TestRecordActions from '../../store/test-records/test-record-service.actions';

describe('TestRecordService', () => {
  let service: TestRecordService;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideMockStore({ initialState: initialAppState })]
    }).compileComponents();

    service = TestBed.inject(TestRecordService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request id and return the value', (done) => {
    let serviceObservable = service.getTestRecords('123');

    serviceObservable.subscribe((value) => {
      expect(value).toStrictEqual([]);
      done();
    });

    store.dispatch(TestRecordActions.getBySystemIdSuccess({'testRecords': [] }));
    
  });
});
