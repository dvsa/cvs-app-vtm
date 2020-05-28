import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {async, ComponentFixture, fakeAsync, getTestBed, TestBed, tick} from '@angular/core/testing';
import { appReducers } from '@app/store/reducers/app.reducers';
import { IAppState } from '@app/store/state/app.state';
import { INITIAL_STATE, Store, StoreModule } from '@ngrx/store';
import { hot } from 'jasmine-marbles';
import { Subject, of } from 'rxjs';
import { TechnicalRecordCreateComponent } from './technical-record-create.component';
import {TechnicalRecordService} from '@app/technical-record-search/technical-record.service';
import {RouterTestingModule} from '@angular/router/testing';
import {TechnicalRecordServiceMock} from '../../../testconfig/services-mocks/technical-record-service.mock';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatDialogModule} from '@angular/material/dialog';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '@app/material.module';
import {SharedModule} from '@app/shared/shared.module';
import {By} from '@angular/platform-browser';

describe('TechnicalRecordSearchComponent', () => {

  let component: TechnicalRecordCreateComponent;
  let fixture: ComponentFixture<TechnicalRecordCreateComponent>;
  let store: Store<IAppState>;
  let injector: TestBed;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TechnicalRecordCreateComponent],
      imports: [
        StoreModule.forRoot(appReducers),
        HttpClientTestingModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MaterialModule,
        SharedModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide : TechnicalRecordService, useValue: TechnicalRecordServiceMock },
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', { a: INITIAL_STATE })),
            select: jest.fn()
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(TechnicalRecordCreateComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    component.formError$ = of(['test-error']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('form invalid when empty', () => {
    component.createTechRecordForm.controls.vehicleType.setValue('');
    component.createTechRecordForm.controls.vin.setValue('');
    component.createTechRecordForm.controls.vrm.setValue('');
    expect(component.createTechRecordForm.valid).toBeFalsy();
  });

  it('form should be valid when fields not empty', () => {
    component.createTechRecordForm.controls.vehicleType.setValue('PSV');
    component.createTechRecordForm.controls.vin.setValue('aaa');
    component.createTechRecordForm.controls.vrm.setValue('aaa');
    expect(component.createTechRecordForm.valid).toBeTruthy();
  });

  it('check vin validity', () => {
    const vin = component.createTechRecordForm.controls.vin;
    expect(vin.valid).toBeFalsy();

    vin.setValue('');
    expect(vin.hasError('required')).toBeTruthy();
  });

  it('check vrm validity', () => {
    const vrm = component.createTechRecordForm.controls.vrm;
    expect(vrm.valid).toBeFalsy();

    vrm.setValue('');
    expect(vrm.hasError('required')).toBeTruthy();
  });

  it('should call onSubmit method', () => {
    spyOn(component, 'onSubmit');
    const element = fixture.debugElement.query(By.css('button')).nativeElement;
    element.click();
    expect(component.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('should set the focus on timeout', fakeAsync(() => {
    const element1 = fixture.debugElement.query(By.css('#test-vin')).nativeElement;
    const element2 = fixture.debugElement.query(By.css('#test-vrm')).nativeElement;

    component.onSubmit();
    tick(10000);
    spyOn(element1, 'focus');
    spyOn(element2, 'focus');
    expect(element1).not.toBeNull();
    expect(element2).not.toBeNull();

  }));

  it('should change VRM label on PSV type select', () => {
    const event = {currentTarget: {checked: false, id: 'test-radio-PSV'}};
    const vrmControl = component.createTechRecordForm.get('vrm');

    component.setVrmValidators(event);
    expect(vrmControl).not.toBeNull();
    expect(component.vrmLabel).toEqual('Vehicle registration mark (VRM)');
  });

  it('should change VRM label on Trailer type select', () => {
    const event = {currentTarget: {checked: false, id: 'test-radio-Trailer'}};
    const vrmControl = component.createTechRecordForm.get('vrm');

    component.setVrmValidators(event);
    expect(vrmControl).not.toBeNull();
    expect(component.vrmLabel).toEqual('Vehicle registration mark (VRM - optional)');
  });

  it('should update formValues onSubmit', () => {
    component.createTechRecordForm.controls.vin.setValue('');
    component.createTechRecordForm.controls.vrm.setValue('');
    component.createTechRecordForm.controls.vehicleType.setValue('');

    component.onSubmit();
    expect(component.formErrors.vinErr).toEqual('Enter a VIN');
    expect(component.formErrors.vrmErr).toEqual('Enter a VRM');
    expect(component.formErrors.vTypeErr).toEqual('Select a vehicle type');
  });

  it('should update formValues onSubmit - empty for form valid', () => {
    component.createTechRecordForm.controls.vin.setValue('aaa');
    component.createTechRecordForm.controls.vrm.setValue('sss');
    component.createTechRecordForm.controls.vehicleType.setValue('dddd');

    component.onSubmit();
    expect(component.formErrors.vinErr).toEqual('');
    expect(component.formErrors.vrmErr).toEqual('');
    expect(component.formErrors.vTypeErr).toEqual('');
  });

});
