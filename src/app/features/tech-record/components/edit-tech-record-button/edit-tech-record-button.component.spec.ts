import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockStore } from '@ngrx/store/testing';
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
import { updateTechRecordsSuccess } from '@store/technical-records';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';

describe('EditTechRecordButtonComponent', () => {
  let component: EditTechRecordButtonComponent;
  let fixture: ComponentFixture<EditTechRecordButtonComponent>;
  let router: Router;
  let actions$ = new ReplaySubject<Action>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditTechRecordButtonComponent],
      providers: [
        GlobalErrorService,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialAppState }),
        { provide: APP_BASE_HREF, useValue: '/' }
      ],
      imports: [
        DynamicFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTechRecordButtonComponent);
    router = TestBed.inject(Router);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT have edit button viewable if viewable tech record is archived', () => {
    component.vehicleTechRecord = <VehicleTechRecordModel>{ techRecord: [{ statusCode: 'archived', vehicleType: 'psv' }] };
    component.viewableTechRecord = <TechRecordModel>{ statusCode: 'archived', vehicleType: 'psv' };
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#edit'));

    expect(button).toBeFalsy;
    expect(component.isArchived).toBeTruthy;
  });

  it('should have edit button viewable if viewable tech record is provisional', () => {
    component.vehicleTechRecord = <VehicleTechRecordModel>{ techRecord: [{ statusCode: 'provisional' }] };
    component.viewableTechRecord = <TechRecordModel>{ statusCode: 'provisional', vehicleType: 'psv' };
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#edit'));

    expect(button).toBeTruthy;
    expect(component.isArchived).toBeFalsy;
  });

  it('should have edit button viewable if viewable tech record is current AND provisional DOES NOT exist', () => {
    component.vehicleTechRecord = <VehicleTechRecordModel>{ techRecord: [{ statusCode: 'current', vehicleType: 'psv' }] };
    component.viewableTechRecord = <TechRecordModel>{ statusCode: 'current', vehicleType: 'psv' };
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#edit'));

    expect(button).toBeTruthy;
  });

  it('should dispatch action to update and archive existing provisional record if viewable tech record is provisional', fakeAsync(() => {
    component.vehicleTechRecord = <VehicleTechRecordModel>{ techRecord: [{ statusCode: 'provisional', vehicleType: 'psv' }] };
    component.viewableTechRecord = <TechRecordModel>{ statusCode: 'provisional', vehicleType: 'psv' };
    component.editableState = true;
    component.isDirty = true;
    fixture.detectChanges();

    jest.spyOn(component, 'submitTechRecord');

    fixture.debugElement.query(By.css('#submit')).nativeElement.click();

    expect(component.submitTechRecord).toHaveBeenCalled();
  }));

  it('should dispatch action to create provisional if viewable tech record is current and no provisional exists', fakeAsync(() => {
    component.vehicleTechRecord = <VehicleTechRecordModel>{ techRecord: [{ statusCode: 'current', vehicleType: 'psv' }] };
    component.viewableTechRecord = <TechRecordModel>{ statusCode: 'current', vehicleType: 'psv' };
    component.editableState = true;
    component.isDirty = true;
    fixture.detectChanges();

    jest.spyOn(component, 'submitTechRecord');

    fixture.debugElement.query(By.css('#submit')).nativeElement.click();

    expect(component.submitTechRecord).toHaveBeenCalled();
  }));

  it('should promt user if cancelling an amend with a dirty form.', fakeAsync(() => {

    component.vehicleTechRecord = <VehicleTechRecordModel>{techRecord: [{statusCode: 'current', vehicleType: 'psv' }]};
    component.viewableTechRecord = <TechRecordModel>{statusCode: 'current', vehicleType: 'psv'};

    component.editableState = true;
    component.isDirty = true;
    fixture.detectChanges();

    window.confirm = jest.fn(() => false)
    jest.spyOn(component, 'cancelAmend');
    jest.spyOn(component, 'toggleEditMode');

    fixture.debugElement.query(By.css('#cancel')).nativeElement.click();

    expect(component.cancelAmend).toHaveBeenCalled();
    expect(component.toggleEditMode).toBeCalledTimes(0);
    expect(component.editableState).toBeTruthy();
  }))

  it('should promt user if cancelling an amend with a dirty form and toggle edit on OK confirmation.', fakeAsync(() => {

    component.vehicleTechRecord = <VehicleTechRecordModel>{techRecord: [{statusCode: 'current', vehicleType: 'psv' }]};
    component.viewableTechRecord = <TechRecordModel>{statusCode: 'current', vehicleType: 'psv'};

    component.editableState = true;
    component.isDirty = true;
    fixture.detectChanges();

    window.confirm = jest.fn(() => true)
    jest.spyOn(component, 'cancelAmend');
    jest.spyOn(component, 'toggleEditMode');

    fixture.debugElement.query(By.css('#cancel')).nativeElement.click();

    expect(component.cancelAmend).toHaveBeenCalled();
    expect(component.toggleEditMode).toHaveBeenCalled();
    expect(component.editableState).toBeFalsy();
  }))

  it('should promt user if cancelling an amend with a dirty form and NOT toggle edit on Cancel confirmation.', fakeAsync(() => {

    component.vehicleTechRecord = <VehicleTechRecordModel>{techRecord: [{statusCode: 'current', vehicleType: 'psv' }]};
    component.viewableTechRecord = <TechRecordModel>{statusCode: 'current', vehicleType: 'psv'};
    component.editableState = true;
    component.isDirty = true;
    fixture.detectChanges();

    window.confirm = jest.fn(() => false)
    jest.spyOn(component, 'cancelAmend');
    jest.spyOn(component, 'toggleEditMode');

    fixture.debugElement.query(By.css('#cancel')).nativeElement.click();

    expect(component.cancelAmend).toHaveBeenCalled();
    expect(component.toggleEditMode).toHaveBeenCalledTimes(0);
    expect(component.editableState).toBeTruthy();
  }))

  it('should NOT promt user if cancelling an amend with a clean form.', fakeAsync(() => {

    component.vehicleTechRecord = <VehicleTechRecordModel>{techRecord: [{statusCode: 'current', vehicleType: 'psv' }]}
    component.viewableTechRecord = <TechRecordModel>{statusCode: 'current', vehicleType: 'psv'};

    component.editableState = true;
    component.isDirty = false;
    fixture.detectChanges();

    window.confirm = jest.fn(() => true)
    jest.spyOn(component, 'cancelAmend');
    jest.spyOn(component, 'toggleEditMode');

    fixture.debugElement.query(By.css('#cancel')).nativeElement.click();

    expect(component.cancelAmend).toHaveBeenCalled();
    expect(component.toggleEditMode).toHaveBeenCalled();
    expect(component.editableState).toBeFalsy();
  }))

  const expectedDate = new Date();
  const expectedResult = {
    vehicleTechRecords: [{
      systemNumber: '1',
      vin: '1',
      techRecord: [{ createdAt: expectedDate } as TechRecordModel]
    } as VehicleTechRecordModel]
  };

  it('router should be called on updateTechRecordsSuccess', fakeAsync(() => {
    const navigateByUrlSpy = jest.spyOn(router, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));

    actions$.next(updateTechRecordsSuccess(expectedResult));

    tick();

    expect(navigateByUrlSpy).toHaveBeenCalledTimes(1);
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/tech-records/1/1/historic/' + expectedDate.getTime());
  }));
});
