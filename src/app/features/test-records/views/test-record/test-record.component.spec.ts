import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiModule as TestResultsApiModule } from '@api/test-results';
import { masterTpl } from '@forms/templates/test-records/master.template';
import { TestResultModel } from '@models/test-result.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
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
        }
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
      expect(el.query(By.css('button#cancel-edit-test-result'))).toBeTruthy();
    });

    it('should run handleSave when save button is clicked', () => {
      mockRouteEditable = store.overrideSelector(routeEditable, true);

      jest.spyOn(component, 'isTestTypeGroupEditable$', 'get').mockReturnValue(of(true));

      fixture.detectChanges();

      jest.spyOn(component, 'handleSave');
      el.query(By.css('button#save-test-result')).triggerEventHandler('click', {});
      expect(component.handleSave).toHaveBeenCalledTimes(1);
    });

    it('should display cancel button when edit query param is true', () => {
      mockRouteEditable = store.overrideSelector(routeEditable, true);

      jest.spyOn(component, 'isTestTypeGroupEditable$', 'get').mockReturnValue(of(true));
      fixture.detectChanges();

      expect(el.query(By.css('button#cancel-edit-test-result'))).toBeTruthy();
    });

    it('should navigate without query param when cancel button is clicked', () => {
      const handleCancelSpy = jest.spyOn(component, 'handleCancel');
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(component, 'isTestTypeGroupEditable$', 'get').mockReturnValue(of(true));

      mockRouteEditable = store.overrideSelector(routeEditable, true);

      fixture.detectChanges();

      el.query(By.css('button#cancel-edit-test-result')).nativeElement.click();
      fixture.detectChanges();

      expect(handleCancelSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith([], { relativeTo: route, queryParams: { edit: null }, queryParamsHandling: 'merge' });
    });

    it('should display edit button when edit query param is false', () => {
      mockRouteEditable = store.overrideSelector(routeEditable, false);
      jest.spyOn(component, 'isTestTypeGroupEditable$', 'get').mockReturnValue(of(true));

      fixture.detectChanges();

      expect(el.query(By.css('button#edit-test-result'))).toBeTruthy();
    });

    it('should navigate with query param "edit=true" when edit button is clicked', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(component, 'isTestTypeGroupEditable$', 'get').mockReturnValue(of(true));

      const handleEditSpy = jest.spyOn(component, 'handleEdit');
      mockRouteEditable = store.overrideSelector(routeEditable, false);

      fixture.detectChanges();

      el.query(By.css('button#edit-test-result')).nativeElement.click();
      fixture.detectChanges();

      expect(handleEditSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith([], { relativeTo: route, queryParams: { edit: 'true' }, queryParamsHandling: 'merge' });
    });
  });

  describe('getters', () => {
    describe('isTestTypeGroupEditable$', () => {
      it('should return true if the test type id is in a valid test type group and the test type group is in the master template', done => {
        component.testResult$ = of({ vehicleType: 'psv', testTypes: [{ testTypeId: '1' }] } as TestResultModel);
        component.isTestTypeGroupEditable$.subscribe(isValid => {
          expect(isValid).toBe(true);
          done();
        });
      });

      it('should return false if the test type id is not in a test type gorup', done => {
        component.testResult$ = of({ vehicleType: 'psv', testTypes: [{ testTypeId: 'foo' }] } as TestResultModel);
        component.isTestTypeGroupEditable$.subscribe(isValid => {
          expect(isValid).toBe(false);
          done();
        });
      });

      it('should return false if the test type group is not in the master template', done => {
        component.testResult$ = of({ vehicleType: 'psv', testTypes: [{ testTypeId: '185' }] } as TestResultModel);
        component.isTestTypeGroupEditable$.subscribe(isValid => {
          expect(isValid).toBe(false);
          done();
        });
      });

      it('should return false if the testResult is undefined', done => {
        component.testResult$ = of(undefined);
        component.isTestTypeGroupEditable$.subscribe(isValid => {
          expect(isValid).toBe(false);
          done();
        });
      });
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

      // store.overrideSelector(isSameTestTypeId, true);
      // store.overrideSelector(selectedAmendedTestResultState, { testTypes: [{ testNumber: 'foo' }] } as TestResultModel);
      // store.overrideSelector(selectedTestResultState, { testTypes: [{ testNumber: 'foo' }] } as TestResultModel);
      // jest.spyOn(testRecordsService, 'isSameTestTypeId$', 'get').mockReturnValue(of(true));
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
      const handleCancelSpy = jest.spyOn(component, 'handleCancel');

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
