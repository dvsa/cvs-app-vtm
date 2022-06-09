import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { initialAppState } from '@store/.';
import { of } from 'rxjs';
import { TestRecordComponent } from './test-record.component';
import { SharedModule } from '@shared/shared.module';
import { DynamicFormsModule } from '../../../../forms/dynamic-forms.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BaseTestRecordComponent } from '../../components/base-test-record/base-test-record.component';
import { MemoizedSelector, DefaultProjectorFn } from '@ngrx/store';
import { routeEditable } from '@store/router/selectors/router.selectors';
import { RouterService } from '@services/router/router.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('TestRecordComponent', () => {
  let component: TestRecordComponent;
  let fixture: ComponentFixture<TestRecordComponent>;
  let el: DebugElement;
  let mockRouteEditable: MemoizedSelector<any, boolean, DefaultProjectorFn<boolean>>;
  let store: MockStore;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TestRecordComponent, BaseTestRecordComponent],
      imports: [HttpClientTestingModule, SharedModule, DynamicFormsModule, RouterTestingModule],
      providers: [TestRecordsService, provideMockStore({ initialState: initialAppState }), RouterService]
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display anything when there is no data', fakeAsync(() => {
    component.testResult$ = of(undefined);
    tick();
    fixture.detectChanges();
    expect(el.query(By.css('h1'))).toBeNull();
  }));

  describe('button actions', () => {
    it('should display save button when edit query param is true', fakeAsync(() => {
      mockRouteEditable = store.overrideSelector(routeEditable, true);

      tick();
      fixture.detectChanges();

      expect(el.query(By.css('button#cancel-edit-test-result'))).toBeTruthy();
    }));

    it('should display cancel button when edit query param is true', fakeAsync(() => {
      mockRouteEditable = store.overrideSelector(routeEditable, true);

      tick();
      fixture.detectChanges();

      expect(el.query(By.css('button#cancel-edit-test-result'))).toBeTruthy();
    }));

    it('should navigate without query param when cancel button is clicked', fakeAsync(() => {
      const handleCancelSpy = jest.spyOn(component, 'handleCancel');
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
      mockRouteEditable = store.overrideSelector(routeEditable, true);

      tick();
      fixture.detectChanges();

      el.query(By.css('button#cancel-edit-test-result')).nativeElement.click();
      tick();
      fixture.detectChanges();

      expect(handleCancelSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith([], { relativeTo: route });
    }));

    it('should display edit button when edit query param is false', fakeAsync(() => {
      mockRouteEditable = store.overrideSelector(routeEditable, false);

      tick();
      fixture.detectChanges();

      expect(el.query(By.css('button#edit-test-result'))).toBeTruthy();
    }));

    it('should navigate with edit query param when edit button is clicked', fakeAsync(() => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
      const handleEditSpy = jest.spyOn(component, 'handleEdit');
      mockRouteEditable = store.overrideSelector(routeEditable, false);

      tick();
      fixture.detectChanges();

      el.query(By.css('button#edit-test-result')).nativeElement.click();
      tick();
      fixture.detectChanges();

      expect(handleEditSpy).toHaveBeenCalledTimes(1);
      expect(navigateSpy).toHaveBeenCalledWith([], { relativeTo: route, queryParams: { edit: true } });
    }));
  });
});
