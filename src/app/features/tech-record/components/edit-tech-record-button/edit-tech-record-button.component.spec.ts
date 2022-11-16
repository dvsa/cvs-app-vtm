import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { initialAppState } from '@store/.';
import { EditTechRecordButtonComponent } from './edit-tech-record-button.component';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import {
  createProvisionalTechRecordSuccess,
  selectVehicleTechnicalRecordsBySystemNumber,
  updateEditingTechRecordCancel,
  updateTechRecordsSuccess
} from '@store/technical-records';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { clearError } from '@store/global-error/actions/global-error.actions';
import { selectedAmendedTestResultState } from '@store/test-records';
import { mockTestResult } from '@mocks/mock-test-result';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';

let component: EditTechRecordButtonComponent;
let fixture: ComponentFixture<EditTechRecordButtonComponent>;
let router: Router;
let store: MockStore;
let actions$: ReplaySubject<Action>;

describe('EditTechRecordButtonComponent', () => {
  beforeEach(async () => {
    actions$ = new ReplaySubject<Action>();

    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      declarations: [EditTechRecordButtonComponent],
      providers: [
        GlobalErrorService,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialAppState }),
        { provide: APP_BASE_HREF, useValue: '/' }
      ],
      imports: [DynamicFormsModule, HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTechRecordButtonComponent);
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('component', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('when viewing a tech record', () => {
    it.each([
      ['should be viewable', 'provisional', true],
      ['should be viewable', 'current', true],
      ['should not be viewable', 'archived', false]
    ])('edit button %s for %s record', (isViewable: string, statusCode: string, expected: boolean) => {
      component.viewableTechRecord = <TechRecordModel>{ statusCode: statusCode, vehicleType: 'psv' };

      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('#edit'));

      expected ? expect(button).toBeTruthy() : expect(button).toBeFalsy();
    });
  });

  describe('when user clicks edit button', () => {
    it('component should nagivate away for current ammendments', () => {
      jest.spyOn(router, 'navigate');
      component.viewableTechRecord = <TechRecordModel>{ statusCode: 'current' };

      fixture.detectChanges();
      fixture.debugElement.query(By.css('#edit')).nativeElement.click();

      expect(router.navigate).toHaveBeenCalled();
    });
    it('component should nagivate away for notifyable alterations', () => {
      jest.spyOn(router, 'navigate');
      component.viewableTechRecord = <TechRecordModel>{ statusCode: 'provisional' };

      fixture.detectChanges();
      fixture.debugElement.query(By.css('#edit')).nativeElement.click();

      expect(router.navigate).toHaveBeenCalled();
    });
  });

  describe('when amending a current tech record', () => {
    let expectedResult: TechnicalRecordServiceState;
    let expectedDate: Date;
    beforeEach(() => {
      store = TestBed.inject(MockStore);
      expectedDate = new Date();
      expectedResult = <TechnicalRecordServiceState>{
        vehicleTechRecords: [
          {
            systemNumber: '1',
            vin: '1',
            techRecord: [<TechRecordModel>{ createdAt: expectedDate }]
          } as VehicleTechRecordModel
        ]
      };
      store.overrideSelector(selectVehicleTechnicalRecordsBySystemNumber, expectedResult.vehicleTechRecords[0]);
      component.vehicleTechRecord = <VehicleTechRecordModel>{ techRecord: [{ statusCode: 'current', vehicleType: 'psv' }] };
      component.viewableTechRecord = <TechRecordModel>{ statusCode: 'current', vehicleType: 'psv' };
      component.isEditing = true;
    });

    describe('and the user submits their changes', () => {
      it('component should emit event', fakeAsync(() => {
        jest.spyOn(component.submitChange, 'emit');

        fixture.detectChanges();
        fixture.debugElement.query(By.css('#submit')).nativeElement.click();

        expect(component.submitChange.emit).toHaveBeenCalledTimes(1);
      }));

      it('router should be called on updateTechRecordsSuccess', fakeAsync(() => {
        jest.spyOn(router, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));

        actions$.next(updateTechRecordsSuccess(expectedResult));

        tick();

        expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/tech-records/1/1/provisional');
      }));

      it('router should be called on createProvisionalTechRecordSuccess', fakeAsync(() => {
        jest.spyOn(router, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));

        actions$.next(createProvisionalTechRecordSuccess(expectedResult));

        tick();

        expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/tech-records/1/1/provisional');
      }));
    });

    describe('and the user cancels their changes', () => {
      describe('and the form is dirty', () => {
        beforeEach(() => {
          component.isDirty = true;
          jest.resetAllMocks();
          jest.spyOn(component, 'cancel');
          jest.spyOn(component, 'toggleEditMode');
          jest.spyOn(router, 'navigate');
        });

        it('should prompt user if they wish to cancel', () => {
          jest.spyOn(window, 'confirm');

          fixture.detectChanges();

          fixture.debugElement.query(By.css('#cancel')).nativeElement.click();

          expect(window.confirm).toHaveBeenCalledWith('Your changes will not be saved. Are you sure?');
        });

        describe('and the user cancels cancelling an amendment', () => {
          it('should keep user in edit view', fakeAsync(() => {
            jest.spyOn(window, 'confirm').mockImplementation(() => false);
            jest.spyOn(store, 'dispatch');

            fixture.detectChanges();
            fixture.debugElement.query(By.css('#cancel')).nativeElement.click();

            expect(component.cancel).toHaveBeenCalled();
            expect(component.toggleEditMode).not.toHaveBeenCalled();
            expect(component.isEditingChange).toBeTruthy();
            expect(window.confirm).toHaveBeenCalledTimes(1);
            expect(window.confirm).toHaveBeenCalledWith('Your changes will not be saved. Are you sure?');
            expect(router.navigate).not.toHaveBeenCalled();
            expect(store.dispatch).not.toHaveBeenCalled();
            expect(router.navigate).not.toHaveBeenCalled();
          }));
        });

        describe('and the user confirms cancelling the amendment', () => {
          it('should return user back to non-edit view', fakeAsync(() => {
            jest.spyOn(window, 'confirm').mockImplementation(() => true);
            jest.spyOn(store, 'dispatch');

            fixture.detectChanges();
            fixture.debugElement.query(By.css('#cancel')).nativeElement.click();

            expect(router.navigate).toHaveBeenCalled();
            expect(component.cancel).toHaveBeenCalled();
            expect(component.toggleEditMode).toHaveBeenCalled();
            expect(component.isEditing).toBeFalsy();
            expect(window.confirm).toHaveBeenCalledTimes(1);
            expect(window.confirm).toHaveBeenCalledWith('Your changes will not be saved. Are you sure?');
            expect(store.dispatch).toHaveBeenNthCalledWith(1, clearError());
            expect(store.dispatch).toHaveBeenNthCalledWith(2, updateEditingTechRecordCancel());
          }));
        });
      });

      describe('and the form is not dirty', () => {
        beforeEach(() => {
          component.isDirty = false;
        });

        it('should not prompt user if they wish to cancel', fakeAsync(() => {
          jest.spyOn(window, 'confirm');
          fixture.detectChanges();

          fixture.debugElement.query(By.css('#cancel')).nativeElement.click();

          expect(window.confirm).not.toHaveBeenCalled();
        }));

        it('should return user to non-edit view', fakeAsync(() => {
          jest.spyOn(component, 'cancel');
          jest.spyOn(component, 'toggleEditMode');
          jest.spyOn(store, 'dispatch');

          fixture.detectChanges();

          fixture.debugElement.query(By.css('#cancel')).nativeElement.click();

          expect(component.cancel).toHaveBeenCalled();
          expect(component.toggleEditMode).toHaveBeenCalled();
          expect(component.isEditing).toBeFalsy();
          expect(store.dispatch).toHaveBeenNthCalledWith(1, clearError());
          expect(store.dispatch).toHaveBeenNthCalledWith(2, updateEditingTechRecordCancel());
        }));
      });
    });
  });
});
