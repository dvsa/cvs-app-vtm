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
import { lastValueFrom, of, ReplaySubject } from 'rxjs';
import { HydrateNewVehicleRecordComponent } from './hydrate-new-vehicle-record.component';
import { createVehicleRecordSuccess } from '@store/technical-records';
import { mockVehicleTechnicalRecordList } from '@mocks/mock-vehicle-technical-record.mock';

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

  describe('get vehicle$', () => {
    it('should return the editable vehicle', () => {
      const expectedVehicle = mockVehicleTechnicalRecordList().pop();

      jest.spyOn(techRecordService, 'editableVehicleTechRecord$', 'get').mockReturnValue(of(expectedVehicle));

      expect(lastValueFrom(component.vehicle$)).resolves.toEqual(expectedVehicle);
    });
  });

  describe('navigate', () => {
    it('should clear all errors', () => {
      jest.spyOn(router, 'navigate').mockImplementation();

      const clearErrorsSpy = jest.spyOn(errorService, 'clearErrors');

      component.navigate();

      expect(clearErrorsSpy).toHaveBeenCalledTimes(1);
    });

    it('should navigate back to batch results', () => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

      component.navigate();

      expect(navigateSpy).toBeCalledWith(['batch-results'], { relativeTo: route });
    });
  });

  describe('handleSubmit', () => {
    it('should not dispatch createVehicleRecord', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.isInvalid = true;

      component.handleSubmit();

      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should navigate back', fakeAsync(() => {
      const navigateSpy = jest.spyOn(router, 'navigate').mockImplementation();

      component.handleSubmit();

      actions$.next(createVehicleRecordSuccess({ vehicleTechRecords: [{ systemNumber: '007' }] }));
      tick();

      expect(navigateSpy).toHaveBeenCalledTimes(1);
    }));
  });
});
