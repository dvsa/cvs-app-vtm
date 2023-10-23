import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { State, initialAppState } from '@store/.';
import { initialContingencyTest } from '@store/test-records';
import {
  Observable,
  ReplaySubject,
  firstValueFrom,
  of,
  throwError,
} from 'rxjs';
import { contingencyTestResolver } from './contingency-test.resolver';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

describe('ContingencyTestResolver', () => {
  let resolver: ResolveFn<boolean>;
  const actions$ = new ReplaySubject<Action>();
  let store: MockStore<State>;
  let techRecordService: TechnicalRecordService;

  const MockUserService = {
    getUserName$: jest.fn().mockReturnValue(new Observable()),
    get user$() {
      return of('foo');
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        provideMockStore({ initialState: initialAppState }),
        provideMockActions(() => actions$),
        TechnicalRecordService,
        { provide: UserService, useValue: MockUserService },
      ],
    });
    resolver = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => contingencyTestResolver(...resolverParameters));
    store = TestBed.inject(MockStore);
    techRecordService = TestBed.inject(TechnicalRecordService);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should return true and dispatch the initial contingency test action', async () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    jest.spyOn(techRecordService, 'techRecord$', 'get').mockReturnValue(of(mockVehicleTechnicalRecord('psv') as TechRecordType<'psv'>));
    const result = TestBed.runInInjectionContext(
      () => resolver({} as ActivatedRouteSnapshot,{} as RouterStateSnapshot)) as Observable<boolean>;
    const resolveResult = await firstValueFrom(result);

    expect(resolveResult).toBe(true);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: initialContingencyTest.type, testResult: expect.anything() }));
  });

  it('should return false if there is an error', async () => {
    jest.spyOn(techRecordService, 'techRecord$', 'get').mockReturnValue(of(mockVehicleTechnicalRecord('psv') as TechRecordType<'psv'>));
    jest.spyOn(MockUserService, 'user$', 'get').mockImplementationOnce(() => throwError(() => new Error('foo')));
    const result = TestBed.runInInjectionContext(
      () => resolver({} as ActivatedRouteSnapshot,{} as RouterStateSnapshot)) as Observable<boolean>;
    const resolveResult = await firstValueFrom(result);
    expect(resolveResult).toBe(false);
  });
});
