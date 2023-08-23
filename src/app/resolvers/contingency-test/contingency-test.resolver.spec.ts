import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { State, initialAppState } from '@store/.';
import { Observable, ReplaySubject, firstValueFrom, of, throwError } from 'rxjs';
import { ContingencyTestResolver } from './contingency-test.resolver';

describe('ContingencyTestResolver', () => {
  let resolver: ContingencyTestResolver;
  let actions$ = new ReplaySubject<Action>();
  let store: MockStore<State>;
  let techRecordService: TechnicalRecordService;

  const MockUserService = {
    getUserName$: jest.fn().mockReturnValue(new Observable()),
    get user$() {
      return of('foo');
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        provideMockStore({ initialState: initialAppState }),
        provideMockActions(() => actions$),
        TechnicalRecordService,
        { provide: UserService, useValue: MockUserService }
      ]
    });
    resolver = TestBed.inject(ContingencyTestResolver);
    store = TestBed.inject(MockStore);
    techRecordService = TestBed.inject(TechnicalRecordService);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
  // TODO: V3 issue with isEditing typeError: Cannot read properties of undefined (reading 'isEditing')
  it('should return true and dispatch the initial contingency test action', async () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    jest.spyOn(techRecordService, 'techRecord$', 'get').mockReturnValue(of({ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' }));
    mockVehicleTechnicalRecord();
    jest.spyOn(techRecordService, 'techRecord$', 'get');
    jest.spyOn(techRecordService, 'viewableTechRecord$', 'get').mockReturnValue(of(mockVehicleTechnicalRecord().techRecord[0]));

    const resolveResult = await firstValueFrom(resolver.resolve());
    expect(resolveResult).toBe(true);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: initialContingencyTest.type, testResult: expect.anything() }));
  });

  it('should return false if there is an error', async () => {
    jest
      .spyOn(techRecordService, 'techRecord$', 'get')
      .mockReturnValue(of({ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as V3TechRecordModel));
    jest.spyOn(techRecordService, 'viewableTechRecord$', 'get').mockReturnValue(of(mockVehicleTechnicalRecord().techRecord[0]));
    jest.spyOn(MockUserService, 'user$', 'get').mockImplementationOnce(() => throwError(() => new Error('foo')));
    const resolveResult = await firstValueFrom(resolver.resolve());
    expect(resolveResult).toBe(false);
  });
});
