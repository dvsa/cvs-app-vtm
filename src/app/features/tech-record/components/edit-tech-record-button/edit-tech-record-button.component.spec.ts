import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { StatusCodes, TechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/.';
import { clearError } from '@store/global-error/actions/global-error.actions';
import { createProvisionalTechRecordSuccess, updateEditingTechRecordCancel, updateTechRecordsSuccess } from '@store/technical-records';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { EditTechRecordButtonComponent } from './edit-tech-record-button.component';

let component: EditTechRecordButtonComponent;
let fixture: ComponentFixture<EditTechRecordButtonComponent>;
let router: Router;
let store: MockStore;
let actions$: ReplaySubject<Action>;
let technicalRecordService: TechnicalRecordService;
const mockTechnicalRecordObservable = new BehaviorSubject({ statusCode: StatusCodes.CURRENT } as TechRecordModel);
const updateMockTechnicalRecord = (statusCode: StatusCodes) => mockTechnicalRecordObservable.next({ statusCode } as TechRecordModel);

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
        TechnicalRecordService
      ],
      imports: [DynamicFormsModule, HttpClientTestingModule, RouterTestingModule, SharedModule]
    }).compileComponents();
  });

  beforeEach(() => {
    technicalRecordService = TestBed.inject(TechnicalRecordService);
    jest.spyOn(technicalRecordService, 'viewableTechRecord$', 'get').mockReturnValue(mockTechnicalRecordObservable);
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
    it.each([
      ['should be viewable', 'provisional', true],
      ['should be viewable', 'current', true],
      ['should not be viewable', 'archived', false]
    ])('edit button %s for %s record', (isViewable: string, statusCode: string, expected: boolean) => {
      jest.spyOn(technicalRecordService, 'viewableTechRecord$', 'get').mockReturnValue(of({ statusCode } as TechRecordModel));
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('#edit'));

      expected ? expect(button).toBeTruthy() : expect(button).toBeFalsy();
    });
  });

  describe('when user clicks edit button', () => {
    it('component should navigate away for current amendments', () => {
      jest.spyOn(router, 'navigate');
      jest.spyOn(technicalRecordService, 'viewableTechRecord$', 'get').mockReturnValue(of({ statusCode: 'current' } as TechRecordModel));
      jest.spyOn(window, 'scrollTo').mockImplementation(() => {});

      fixture.detectChanges();
      fixture.debugElement.query(By.css('button#edit')).nativeElement.click();

      expect(router.navigate).toHaveBeenCalled();
    });
    it('component should navigate away for notifiable alterations', () => {
      jest.spyOn(router, 'navigate');
      jest.spyOn(technicalRecordService, 'viewableTechRecord$', 'get').mockReturnValue(of({ statusCode: 'provisional' } as TechRecordModel));

      fixture.detectChanges();
      fixture.debugElement.query(By.css('button#edit')).nativeElement.click();

      expect(router.navigate).toHaveBeenCalled();
    });
  });

  describe('when amending a provisional tech record', () => {
    beforeEach(() => {
      updateMockTechnicalRecord(StatusCodes.PROVISIONAL);
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

      it('router should be called on updateTechRecordsSuccess', fakeAsync(() => {
        jest.spyOn(router, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));

        fixture.detectChanges();
        actions$.next(updateTechRecordsSuccess([]));

        tick();

        expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/tech-records/1/provisional');
      }));

      it('router should be called on createProvisionalTechRecordSuccess', fakeAsync(() => {
        jest.spyOn(router, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));

        actions$.next(createProvisionalTechRecordSuccess([]));

        tick();

        expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/tech-records/1/provisional');
      }));
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

      it('router should be called on updateTechRecordsSuccess', fakeAsync(() => {
        jest.spyOn(router, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));
        store.dispatch(updateTechRecordsSuccess({}));
        actions$.next(updateTechRecordsSuccess({}));

        tick();

        expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/tech-records/1');
      }));

      it('router should be called on createProvisionalTechRecordSuccess', fakeAsync(() => {
        jest.spyOn(router, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));

        actions$.next(createProvisionalTechRecordSuccess({}));

        tick();

        expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/tech-records/1');
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
          jest.spyOn(technicalRecordService, 'viewableTechRecord$', 'get').mockReturnValue(of({ statusCode: 'current' } as TechRecordModel));
          component.isEditing = true;
          jest.spyOn(window, 'confirm').mockImplementation(() => true);

          fixture.detectChanges();

          fixture.debugElement.query(By.css('button#cancel')).nativeElement.click();

          expect(window.confirm).toHaveBeenCalledWith('Your changes will not be saved. Are you sure?');
        });

        describe('and the user cancels cancelling an amendment', () => {
          it('should keep user in edit view', fakeAsync(() => {
            component.isEditing = true;
            jest.spyOn(technicalRecordService, 'viewableTechRecord$', 'get').mockReturnValue(of({ statusCode: 'current' } as TechRecordModel));
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
            jest.spyOn(technicalRecordService, 'viewableTechRecord$', 'get').mockReturnValue(of({ statusCode: 'current' } as TechRecordModel));
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
