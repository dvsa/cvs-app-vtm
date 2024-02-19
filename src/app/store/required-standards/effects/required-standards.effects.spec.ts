import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DefectGETIVA } from '@dvsa/cvs-type-definitions/types/iva/defects/get';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { RequiredStandardsService } from '@services/required-standards/required-standards.service';
import { initialAppState } from '@store/index';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { getRequiredStandards, getRequiredStandardsFailure, getRequiredStandardsSuccess } from '../actions/required-standards.actions';
import { RequiredStandardsEffects } from './required-standards.effects';

describe('RequiredStandardEffects', () => {
  let effects: RequiredStandardsEffects;
  let actions$ = new Observable<Action>();
  let testScheduler: TestScheduler;
  let service: RequiredStandardsService;

  const testCases = [
    {
      requiredStandards: [{
        rsNumber: 1,
      }] as unknown as DefectGETIVA,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RequiredStandardsEffects,
        provideMockActions(() => actions$),
        RequiredStandardsService,
        provideMockStore({
          initialState: initialAppState,
        }),
      ],
    });

    effects = TestBed.inject(RequiredStandardsEffects);
    service = TestBed.inject(RequiredStandardsService);
  });

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('getRequiredStandards$', () => {
    it.each(testCases)('should return requiredStandardsSuccess action on successful API call', (value) => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const { requiredStandards } = value;

        // mock action to trigger effect
        actions$ = hot('-a--', { a: getRequiredStandards({ euVehicleCategory: 'm1' }) });

        // mock service call
        jest.spyOn(service, 'getRequiredStandards').mockReturnValue(cold('--a|', { a: requiredStandards }));

        // expect effect to return success action
        expectObservable(effects.getRequiredStandards$).toBe('---b', {
          b: getRequiredStandardsSuccess({ requiredStandards }),
        });
      });
    });

    it.each(testCases)('should return getRequiredStandardsFailed action on API error', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        actions$ = hot('-a--', { a: getRequiredStandards({ euVehicleCategory: 'm1' }) });

        const expectedError = new Error('No required standards found');

        jest.spyOn(service, 'getRequiredStandards').mockReturnValue(cold('--#|', {}, expectedError));

        expectObservable(effects.getRequiredStandards$).toBe(
          '---b',
          { b: getRequiredStandardsFailure({ error: 'No required standards found' }) },
        );
      });
    });
  });
});
