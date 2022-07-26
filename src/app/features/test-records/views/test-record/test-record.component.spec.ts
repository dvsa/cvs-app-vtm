import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, flushMicrotasks, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiModule as TestResultsApiModule } from '@api/test-results';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { mockTestResult } from '@mocks/mock-test-result';
import { TestResultModel } from '@models/test-result.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/.';
import { referenceDataFeatureState } from '@store/reference-data';
import { routeEditable, selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { updateTestResultSuccess } from '@store/test-records';
import merge from 'lodash.merge';
import { firstValueFrom, of, ReplaySubject, take } from 'rxjs';
import { Z_SYNC_FLUSH } from 'zlib';
import { DynamicFormsModule } from '../../../../forms/dynamic-forms.module';
import { BaseTestRecordComponent } from '../../components/base-test-record/base-test-record.component';
import { TestAmendmentHistoryComponent } from '../../components/test-amendment-history/test-amendment-history.component';
import { TestRecordComponent } from './test-record.component';

describe('TestRecordComponent', () => {
  let component: TestRecordComponent;
  let fixture: ComponentFixture<TestRecordComponent>;
  let el: DebugElement;
  let mockRouteEditable: MemoizedSelector<any, boolean, DefaultProjectorFn<boolean>>;
  let store: MockStore;
  let router: Router;
  let route: ActivatedRoute;
  let testRecordsService: TestRecordsService;
  let actions$ = new ReplaySubject<Action>();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BaseTestRecordComponent, TestAmendmentHistoryComponent, TestRecordComponent],
      imports: [DynamicFormsModule, HttpClientTestingModule, RouterTestingModule, SharedModule, TestResultsApiModule],
      providers: [TestRecordsService, provideMockStore({ initialState: initialAppState }), RouterService, provideMockActions(() => actions$)]
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
    it('should display save button when edit query param is true', fakeAsync(() => {
      mockRouteEditable = store.overrideSelector(routeEditable, true);
      // jest.spyOn(component, 'testTypeGroupIsEditable$', 'get').mockReturnValue(of(true));

      tick();
      fixture.detectChanges();

      expect(el.query(By.css('button#cancel-edit-test-result'))).toBeTruthy();
      discardPeriodicTasks();
    }));

    it('should run handleSave when save button is clicked', fakeAsync(() => {
      mockRouteEditable = store.overrideSelector(routeEditable, true);

      jest.spyOn(component, 'testTypeGroupIsEditable$', 'get').mockReturnValue(of(true));

      tick();
      fixture.detectChanges();

      jest.spyOn(component, 'handleSave');
      el.query(By.css('button#save-test-result')).triggerEventHandler('click', {});
      tick();
      expect(component.handleSave).toHaveBeenCalledTimes(1);
      flush();
    }));

    it('should display cancel button when edit query param is true', fakeAsync(() => {
      mockRouteEditable = store.overrideSelector(routeEditable, true);

      jest.spyOn(component, 'testTypeGroupIsEditable$', 'get').mockReturnValue(of(true));

      tick();
      fixture.detectChanges();

      expect(el.query(By.css('button#cancel-edit-test-result'))).toBeTruthy();
      flush();
    }));

    it('should navigate without query param when cancel button is clicked', fakeAsync(() => {
      const handleCancelSpy = jest.spyOn(component, 'handleCancel');
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(component, 'testTypeGroupIsEditable$', 'get').mockReturnValue(of(true));

      mockRouteEditable = store.overrideSelector(routeEditable, true);

      tick();
      fixture.detectChanges();

      el.query(By.css('button#cancel-edit-test-result')).nativeElement.click();
      tick();
      fixture.detectChanges();

      expect(handleCancelSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith([], { relativeTo: route, queryParams: { edit: null }, queryParamsHandling: 'merge' });
      flushMicrotasks();
    }));

    it('should display edit button when edit query param is false', fakeAsync(() => {
      mockRouteEditable = store.overrideSelector(routeEditable, false);
      jest.spyOn(component, 'testTypeGroupIsEditable$', 'get').mockReturnValue(of(true));

      tick();
      fixture.detectChanges();

      expect(el.query(By.css('button#edit-test-result'))).toBeTruthy();
    }));

    it('should navigate with query param "edit=true" when edit button is clicked', fakeAsync(() => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
      jest.spyOn(component, 'testTypeGroupIsEditable$', 'get').mockReturnValue(of(true));

      const handleEditSpy = jest.spyOn(component, 'handleEdit');
      mockRouteEditable = store.overrideSelector(routeEditable, false);

      tick();
      fixture.detectChanges();

      el.query(By.css('button#edit-test-result')).nativeElement.click();
      tick();
      fixture.detectChanges();

      expect(handleEditSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith([], { relativeTo: route, queryParams: { edit: 'true' }, queryParamsHandling: 'merge' });
    }));
  });

  describe('getters', () => {
    describe('sectionFormsInvalid', () => {
      it.each([
        [true, [{ invalid: true }, { invalid: true }]],
        [true, [{ invalid: true }, { invalid: false }]],
        [false, [{ invalid: false }, { invalid: false }]],
        [false, []]
      ])('should return %p for forms: %o', (expected, forms) => {
        component.sectionForms = forms as Array<CustomFormGroup>;
        expect(component.sectionForms.some(form => form.invalid)).toBe(expected);
      });
    });
    describe('testTypeGroupIsEditable$', () => {
      it('should return true if the test type id is in a valid test type group and the test type group is in the master template', done => {
        component.testResult$ = of({ vehicleType: 'psv', testTypes: [{ testTypeId: '1' }] } as TestResultModel);
        component.testTypeGroupIsEditable$.subscribe(isValid => {
          expect(isValid).toBe(true);
          done();
        });
      });

      it('should return false if the test type id is not in a test type gorup', done => {
        component.testResult$ = of({ vehicleType: 'psv', testTypes: [{ testTypeId: 'foo' }] } as TestResultModel);
        component.testTypeGroupIsEditable$.subscribe(isValid => {
          expect(isValid).toBe(false);
          done();
        });
      });

      it('should return false if the test type group is not in the master template', done => {
        component.testResult$ = of({ vehicleType: 'psv', testTypes: [{ testTypeId: '185' }] } as TestResultModel);
        component.testTypeGroupIsEditable$.subscribe(isValid => {
          expect(isValid).toBe(false);
          done();
        });
      });

      it('should return false if the testResult is undefined', done => {
        component.testResult$ = of(undefined);
        component.testTypeGroupIsEditable$.subscribe(isValid => {
          expect(isValid).toBe(false);
          done();
        });
      });
    });
  });

  describe(TestRecordComponent.prototype.handleSave.name, () => {
    const forms = [
      new CustomFormGroup(
        { name: 'form1', type: FormNodeTypes.GROUP },
        { foo: new CustomFormControl({ name: 'foo', label: 'Foo', type: FormNodeTypes.CONTROL }, '', [Validators.required]) }
      ),
      new CustomFormGroup(
        { name: 'form2', type: FormNodeTypes.GROUP },
        { foo: new CustomFormControl({ name: 'bar', label: 'Bar', type: FormNodeTypes.CONTROL }, '') }
      )
    ];

    beforeEach(() => {
      component.sectionForms = forms as Array<CustomFormGroup>;
      store.resetSelectors();
    });

    it('should return without calling updateTestResultState', fakeAsync(() => {
      const updateTestResultStateSpy = jest.spyOn(testRecordsService, 'updateTestResult');
      component.handleSave();
      tick();
      expect(updateTestResultStateSpy).not.toHaveBeenCalled();
    }));

    it('should call updateTestResult with value of all forms merged into one', fakeAsync(() => {
      const updateTestResultStateSpy = jest.spyOn(testRecordsService, 'updateTestResult').mockImplementation(() => {});
      store.overrideSelector(selectRouteNestedParams, { testResultId: '1', testTypeId: 'a' });
      component.sectionForms[0].get('foo')?.patchValue('baz');

      let expectedFinalValue;
      forms.forEach(form => (expectedFinalValue = merge(form.getCleanValue(form), forms[1].getCleanValue(form))));

      component.handleSave();
      tick();
      expect(updateTestResultStateSpy).toHaveBeenCalledTimes(1);
      expect(updateTestResultStateSpy).toHaveBeenCalledWith(expectedFinalValue);
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
});
