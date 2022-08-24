import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiModule as TestResultsApiModule } from '@api/test-results';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { TestResultModel } from '@models/test-results/test-result.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { UserService } from '@services/user-service/user-service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState, State } from '@store/.';
import { routeEditable, selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { initialTestResultsState, isSameTestTypeId, sectionTemplates, testResultInEdit, updateTestResultSuccess } from '@store/test-records';
import { of, ReplaySubject } from 'rxjs';
import { DynamicFormsModule } from '../../../../forms/dynamic-forms.module';
import { BaseTestRecordComponent } from '../../components/base-test-record/base-test-record.component';
import { TestAmendmentHistoryComponent } from '../../components/test-amendment-history/test-amendment-history.component';
import { TestRecordComponent } from './test-record.component';

describe('TestRecordComponent', () => {
  let component: TestRecordComponent;
  let fixture: ComponentFixture<TestRecordComponent>;
  let el: DebugElement;
  let mockRouteEditable: MemoizedSelector<any, boolean, DefaultProjectorFn<boolean>>;
  let store: MockStore<State>;
  let router: Router;
  let route: ActivatedRoute;
  let testRecordsService: TestRecordsService;
  let techRecordService: TechnicalRecordService;
  let actions$ = new ReplaySubject<Action>();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BaseTestRecordComponent, TestAmendmentHistoryComponent, TestRecordComponent],
      imports: [DynamicFormsModule, HttpClientTestingModule, RouterTestingModule, TestResultsApiModule, SharedModule],
      providers: [
        TestRecordsService,
        provideMockStore({ initialState: initialAppState }),
        RouterService,
        provideMockActions(() => actions$),
        {
          provide: UserService,
          useValue: {
            roles$: of(['TestResult.Amend'])
          }
        },
        TechnicalRecordService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestRecordComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    store = TestBed.inject(MockStore);
    mockRouteEditable = store.overrideSelector(routeEditable, false);
    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    testRecordsService = TestBed.inject(TestRecordsService);
    techRecordService = TestBed.inject(TechnicalRecordService);

    store.resetSelectors();
    store.overrideSelector(selectRouteNestedParams, { testResultId: '1', testNumber: 'foo' } as Params);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display anything when there is no data', fakeAsync(() => {
    component.testResult$ = of(undefined);

    tick();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('h1'))).toBeNull();
  }));

  describe('button actions', () => {
    beforeEach(() => {
      jest
        .spyOn(testRecordsService, 'testResult$', 'get')
        .mockReturnValue(of({ vehicleType: 'psv', testTypes: [{ testTypeId: '1' }] } as TestResultModel));
    });
    it('should display save button when edit query param is true', () => {
      mockRouteEditable = store.overrideSelector(routeEditable, true);
      jest.spyOn(component, 'isTestTypeGroupEditable$', 'get').mockReturnValue(of(true));

      fixture.detectChanges();
      expect(el.query(By.css('button#save-test-result'))).toBeTruthy();
    });

    it('should run handleSave when save button is clicked', () => {
      mockRouteEditable = store.overrideSelector(routeEditable, true);

      jest.spyOn(component, 'isTestTypeGroupEditable$', 'get').mockReturnValue(of(true));

      fixture.detectChanges();

      jest.spyOn(component, 'handleSave');
      el.query(By.css('button#save-test-result')).triggerEventHandler('click', {});
      expect(component.handleSave).toHaveBeenCalledTimes(1);
    });
  });

  describe(TestRecordComponent.prototype.handleSave.name, () => {
    beforeEach(() => {
      store.setState({
        ...initialAppState,
        testRecords: {
          ...initialTestResultsState,
          ids: ['1'],
          entities: { '1': { testTypes: [{ testNumber: 'foo' }] } as TestResultModel },
          editingTestResult: { testTypes: [{ testNumber: 'foo' }] } as TestResultModel
        }
      });
    });

    it('should return without calling updateTestResultState if forms are clean', fakeAsync(() => {
      store.overrideSelector(isSameTestTypeId, true);
      const updateTestResultStateSpy = jest.spyOn(testRecordsService, 'updateTestResult');
      component.handleSave();
      tick();
      expect(updateTestResultStateSpy).not.toHaveBeenCalled();
    }));

    it('should return without calling updateTestResultState if any forms are invalid', fakeAsync(() => {
      const updateTestResultStateSpy = jest.spyOn(testRecordsService, 'updateTestResult');
      component.isAnyFormDirty = jest.fn().mockReturnValue(true);
      component.isAnyFormInvalid = jest.fn().mockReturnValue(true);
      component.handleSave();
      tick();
      expect(updateTestResultStateSpy).not.toHaveBeenCalled();
    }));

    it('should call updateTestResult with value of all forms merged into one', fakeAsync(() => {
      const updateTestResultStateSpy = jest.spyOn(testRecordsService, 'updateTestResult').mockImplementation(() => {});
      const testRecord = { testResultId: '1', testTypes: [{ testTypeId: '2' }] } as TestResultModel;
      store.overrideSelector(isSameTestTypeId, false);
      store.overrideSelector(testResultInEdit, testRecord);
      store.overrideSelector(sectionTemplates, Object.values(masterTpl.psv['testTypesGroup1']));

      tick();
      fixture.detectChanges();

      component.isAnyFormDirty = jest.fn().mockReturnValue(true);
      component.isAnyFormInvalid = jest.fn().mockReturnValue(false);

      component.handleSave();

      tick();

      expect(updateTestResultStateSpy).toHaveBeenCalledTimes(1);
      expect(updateTestResultStateSpy).toHaveBeenCalledWith(testRecord);
    }));
  });

  describe(TestRecordComponent.prototype.watchForUpdateSuccess.name, () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call handleCancel when updateTestResultState is success', fakeAsync(() => {
      const handleCancelSpy = jest.spyOn(component, 'backToTestRecord');

      actions$.next(updateTestResultSuccess({ payload: { id: '', changes: {} as TestResultModel } }));

      tick();

      expect(handleCancelSpy).toHaveBeenCalledTimes(1);
    }));
  });

  describe('Render banner', () => {
    beforeEach(() => {
      jest
        .spyOn(testRecordsService, 'testResult$', 'get')
        .mockReturnValue(of({ vehicleType: 'psv', testTypes: [{ testTypeId: '1' }] } as TestResultModel));
      jest.spyOn(techRecordService, 'selectedVehicleTechRecord$', 'get').mockReturnValue(of(undefined));
    });

    it('should render the banner if the test type id is not supported', () => {
      jest.spyOn(component, 'isTestTypeGroupEditable$', 'get').mockReturnValue(of(false));
      fixture.detectChanges();
      const banner = el.query(By.css('div.govuk-notification-banner'));
      expect(banner).toBeTruthy();
    });

    it('should not render the banner if the test type id is supported', () => {
      jest.spyOn(component, 'isTestTypeGroupEditable$', 'get').mockReturnValue(of(true));
      fixture.detectChanges();
      const banner = el.query(By.css('div.govuk-notification-banner'));
      expect(banner).toBeNull();
    });
  });
});
