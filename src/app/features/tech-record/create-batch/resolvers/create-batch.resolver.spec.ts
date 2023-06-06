import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState, State } from '@store/index';
import { ReplaySubject } from 'rxjs';

import { CreateBatchResolver } from './create-batch.resolver';

describe('CreateBatchResolver', () => {
  let resolver: CreateBatchResolver;
  let actions$ = new ReplaySubject<Action>();
  let store: MockStore<State>;
  let techRecordService: TechnicalRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [provideMockStore({ initialState: initialAppState }), provideMockActions(() => actions$), TechnicalRecordService]
    });
    resolver = TestBed.inject(CreateBatchResolver);
    store = TestBed.inject(MockStore);
    techRecordService = TestBed.inject(TechnicalRecordService);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
