import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { StatusCodes, V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/.';
import { clearError } from '@store/global-error/actions/global-error.actions';
import { updateEditingTechRecordCancel } from '@store/technical-records';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { EditTechRecordButtonComponent } from './edit-tech-record-button.component';

let mockTechRecordService = {
  techRecord$: of({ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', techRecord_statusCode: StatusCodes.CURRENT } as V3TechRecordModel)
};

let component: EditTechRecordButtonComponent;
let fixture: ComponentFixture<EditTechRecordButtonComponent>;
let router: Router;
let store: MockStore;
let actions$: ReplaySubject<Action>;
let technicalRecordService: TechnicalRecordService;
const mockTechnicalRecordObservable = new BehaviorSubject({ techRecord_statusCode: StatusCodes.CURRENT } as V3TechRecordModel);
const updateMockTechnicalRecord = (techRecord_statusCode: StatusCodes) =>
  mockTechnicalRecordObservable.next({ techRecord_statusCode } as V3TechRecordModel);

const mockRouterService = {
  getRouteNestedParam$: () => '1',
  getRouteDataProperty$: () => false
};

describe('EditTechRecordButtonComponent', () => {
  beforeEach(async () => {
    actions$ = new ReplaySubject<Action>();

    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      declarations: [EditTechRecordButtonComponent],
      providers: [
        { provide: RouterService, useValue: mockRouterService },
        GlobalErrorService,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialAppState }),
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: TechnicalRecordService, useValue: mockTechRecordService }
      ],
      imports: [DynamicFormsModule, HttpClientTestingModule, RouterTestingModule, SharedModule]
    }).compileComponents();
  });

  beforeEach(() => {
    technicalRecordService = TestBed.inject(TechnicalRecordService);
    fixture = TestBed.createComponent(EditTechRecordButtonComponent);
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;

    fixture.detectChanges();

    jest.spyOn(window, 'confirm');
  });

  describe('component', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('when viewing a tech record', () => {
    afterAll(() => {
      mockTechRecordService.techRecord$ = of({
        systemNumber: 'foo',
        createdTimestamp: 'bar',
        vin: 'testVin',
        techRecord_statusCode: StatusCodes.CURRENT
      } as unknown as V3TechRecordModel);
    });
    it.each([
      [
        'should be viewable',
        true,
        { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', techRecord_statusCode: StatusCodes.PROVISIONAL } as V3TechRecordModel
      ],
      [
        'should be viewable',
        true,
        { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', techRecord_statusCode: StatusCodes.CURRENT } as V3TechRecordModel
      ],
      [
        'should not be viewable',
        false,
        { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', techRecord_statusCode: StatusCodes.ARCHIVED } as V3TechRecordModel
      ]
    ])('edit button %s for %s record', (isViewable: string, expected: boolean, record: V3TechRecordModel) => {
      mockTechRecordService.techRecord$ = of(record);
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('#edit'));

      expected ? expect(button).toBeTruthy() : expect(button).toBeFalsy();
    });
  });

  describe('when user clicks edit button', () => {
    it('component should navigate away for current amendments', () => {
      mockTechRecordService.techRecord$ = of({
        systemNumber: 'foo',
        createdTimestamp: 'bar',
        vin: 'testVin',
        techRecord_statusCode: StatusCodes.PROVISIONAL
      } as V3TechRecordModel);
      jest.spyOn(router, 'navigate');
      jest.spyOn(window, 'scrollTo').mockImplementation(() => {});

      fixture.detectChanges();
      fixture.debugElement.query(By.css('button#edit')).nativeElement.click();

      expect(router.navigate).toHaveBeenCalledWith(['notifiable-alteration-needed'], { relativeTo: expect.anything() });
    });
    it('component should navigate away for notifiable alterations', () => {
      mockTechRecordService.techRecord$ = of({
        systemNumber: 'foo',
        createdTimestamp: 'bar',
        vin: 'testVin',
        techRecord_statusCode: StatusCodes.CURRENT
      } as V3TechRecordModel);
      jest.spyOn(router, 'navigate');

      fixture.detectChanges();
      fixture.debugElement.query(By.css('button#edit')).nativeElement.click();

      expect(router.navigate).toHaveBeenCalledWith(['amend-reason'], { relativeTo: expect.anything() });
    });
  });

  describe('when amending a provisional tech record', () => {
    beforeEach(() => {
      component.isEditing = true;
    });
    describe('and the user submits their changes', () => {
      it('component should emit event', fakeAsync(() => {
        jest.spyOn(component.submitChange, 'emit');

        fixture.detectChanges();
        fixture.debugElement.query(By.css('button#submit')).nativeElement.click();
        discardPeriodicTasks();

        expect(component.submitChange.emit).toHaveBeenCalledTimes(1);
      }));
      // TODO V3 the button no longer listens for success and the parent component handles it
      //     it.only('router should be called on updateTechRecordsSuccess', fakeAsync(() => {
      //       jest.spyOn(router, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));

      //       fixture.detectChanges();
      //       actions$.next(updateTechRecordsSuccess({vehicleRecord: {systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin'}}));

      //       tick();

      //       expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      //       expect(router.navigateByUrl).toHaveBeenCalledWith('/tech-records/1/provisional');
      //     }));

      //     it('router should be called on createProvisionalTechRecordSuccess', fakeAsync(() => {
      //       jest.spyOn(router, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));

      //       actions$.next(createProvisionalTechRecordSuccess([]));

      //       tick();

      //       expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      //       expect(router.navigateByUrl).toHaveBeenCalledWith('/tech-records/1/provisional');
      //     }));
    });
  });

  describe('when amending a current tech record', () => {
    beforeEach(() => {
      updateMockTechnicalRecord(StatusCodes.CURRENT);
      component.isEditing = true;
    });
    describe('and the user submits their changes', () => {
      it('component should emit event', fakeAsync(() => {
        jest.spyOn(component.submitChange, 'emit');

        fixture.detectChanges();
        fixture.debugElement.query(By.css('button#submit')).nativeElement.click();
        discardPeriodicTasks();

        expect(component.submitChange.emit).toHaveBeenCalledTimes(1);
      }));
      // TODO V3 component not listening for success currently
      // it('router should be called on updateTechRecordsSuccess', fakeAsync(() => {
      //   jest.spyOn(router, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));
      //   store.dispatch(updateTechRecordsSuccess({}));
      //   actions$.next(updateTechRecordsSuccess({}));

      //   tick();

      //   expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      //   expect(router.navigateByUrl).toHaveBeenCalledWith('/tech-records/1');
      // }));

      // it('router should be called on createProvisionalTechRecordSuccess', fakeAsync(() => {
      //   jest.spyOn(router, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));

      //   actions$.next(createProvisionalTechRecordSuccess({}));

      //   tick();

      //   expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      //   expect(router.navigateByUrl).toHaveBeenCalledWith('/tech-records/1');
      // }));
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
          component.isEditing = true;
          jest.spyOn(window, 'confirm').mockImplementation(() => true);

          fixture.detectChanges();

          fixture.debugElement.query(By.css('button#cancel')).nativeElement.click();

          expect(window.confirm).toHaveBeenCalledWith('Your changes will not be saved. Are you sure?');
        });

        describe('and the user cancels cancelling an amendment', () => {
          it('should keep user in edit view', fakeAsync(() => {
            component.isEditing = true;
            jest.spyOn(window, 'confirm').mockImplementation(() => false);
            jest.spyOn(store, 'dispatch');

            fixture.detectChanges();
            fixture.debugElement.query(By.css('button#cancel')).nativeElement.click();

            discardPeriodicTasks();

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
            component.isEditing = true;
            jest.spyOn(window, 'confirm').mockImplementation(() => true);
            jest.spyOn(store, 'dispatch');

            fixture.detectChanges();
            fixture.debugElement.query(By.css('button#cancel')).nativeElement.click();

            discardPeriodicTasks();

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
          component.isEditing = true;
          jest.spyOn(window, 'confirm');
          fixture.detectChanges();

          fixture.debugElement.query(By.css('#cancel')).nativeElement.click();
          discardPeriodicTasks();
          expect(window.confirm).not.toHaveBeenCalled();
        }));

        it('should return user to non-edit view', fakeAsync(() => {
          component.isEditing = true;
          jest.spyOn(window, 'confirm');
          jest.spyOn(component, 'cancel');
          jest.spyOn(component, 'toggleEditMode');
          jest.spyOn(store, 'dispatch');

          fixture.detectChanges();

          fixture.debugElement.query(By.css('button#cancel')).nativeElement.click();

          discardPeriodicTasks();

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
