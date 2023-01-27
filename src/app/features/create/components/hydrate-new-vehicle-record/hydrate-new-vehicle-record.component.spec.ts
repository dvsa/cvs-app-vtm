import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { initialAppState } from '@store/index';
import { of, ReplaySubject } from 'rxjs';
import { HydrateNewVehicleRecordComponent } from './hydrate-new-vehicle-record.component';
import { createVehicleRecord, createVehicleRecordSuccess } from '@store/technical-records';

describe('HydrateNewVehicleRecordComponent', () => {
  let component: HydrateNewVehicleRecordComponent;
  let fixture: ComponentFixture<HydrateNewVehicleRecordComponent>;
  let techRecordService: TechnicalRecordService;
  let actions$ = new ReplaySubject<Action>();
  let errorService: GlobalErrorService;
  let route: ActivatedRoute;
  let router: Router;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HydrateNewVehicleRecordComponent],
      providers: [provideMockActions(() => actions$), provideMockStore({ initialState: initialAppState })],
      imports: [HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HydrateNewVehicleRecordComponent);
    route = TestBed.inject(ActivatedRoute);
    errorService = TestBed.inject(GlobalErrorService);
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    techRecordService = TestBed.inject(TechnicalRecordService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('get Vehicle', () => {
    expect(component.vehicle$).toBeTruthy();
  });

  it('should navigate away on no data', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
    jest.spyOn(component, 'vehicle$', 'get').mockImplementation(() => of(undefined));
    component.ngOnInit();
    expect(navigateSpy).toBeCalledWith(['..'], { relativeTo: route });
  });

  describe('navigateBack', () => {
    it('should clear all errors', () => {
      jest.spyOn(router, 'navigate').mockImplementation();

      const clearErrorsSpy = jest.spyOn(errorService, 'clearErrors');

      component.navigateBack();

      expect(clearErrorsSpy).toHaveBeenCalledTimes(1);
    });

    it('should navigate back to the previous page', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

      component.navigateBack();

      expect(navigateSpy).toBeCalledWith(['..'], { relativeTo: route });
    });
  });

  describe('handleSubmit', () => {
    it('should dispatch createVehicleRecord', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.handleSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(createVehicleRecord());
    });

    it('should navigate back', fakeAsync(() => {
      const navigateSpy = jest.spyOn(router, 'navigate');
      component.handleSubmit();
      actions$.next(createVehicleRecordSuccess);
      tick();
      expect(navigateSpy).toHaveBeenCalledTimes(1);
    }));
  });
});
