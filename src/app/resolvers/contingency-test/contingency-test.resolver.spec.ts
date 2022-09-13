import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { initialAppState } from '@store/.';
import { Observable, ReplaySubject } from 'rxjs';
import { ContingencyTestResolver } from './contingency-test.resolver';

describe('ContingencyTestResolver', () => {
  let resolver: ContingencyTestResolver;
  let actions$ = new ReplaySubject<Action>();

  const MockUserService = {
    getUserName$: jest.fn().mockReturnValue(new Observable())
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideMockStore({ initialState: initialAppState }),
        provideMockActions(() => actions$),
        TechnicalRecordService,
        { provide: UserService, useValue: MockUserService }
      ]
    });
    resolver = TestBed.inject(ContingencyTestResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
