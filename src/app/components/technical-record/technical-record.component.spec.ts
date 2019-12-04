import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, getTestBed} from '@angular/core/testing';
import {TechnicalRecordComponent} from './technical-record.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {APP_BASE_HREF} from '@angular/common';
import {AuthenticationGuard} from 'microsoft-adal-angular6';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MaterialModule} from '../../material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthenticationGuardMock} from '../../../../test-config/services-mocks/authentication-guard.mock';
import {Store, StoreModule} from '@ngrx/store';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../shared/shared.module';
import {ReactiveFormsModule, FormsModule, FormArray} from '@angular/forms';
import {Subject} from 'rxjs';
import {IAppState, INITIAL_STATE} from '@app/store/state/adrDetailsForm.state';
import {appReducers} from '@app/store/reducers/app.reducers';
import {adrDetailsReducer} from '@app/store/reducers/adrDetailsForm.reducer';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgrxFormsModule} from 'ngrx-forms';
import {hot} from 'jasmine-marbles';
import {AdrReasonModalComponent} from '@app/components/adr-reason-modal/adr-reason-modal.component';

describe('TechnicalRecordComponent', () => {

  let component: TechnicalRecordComponent;
  let fixture: ComponentFixture<TechnicalRecordComponent>;
  const authenticationGuardMock = new AuthenticationGuardMock();
  const unsubscribe = new Subject<void>();
  let injector: TestBed;
  let store: Store<IAppState>;
  const axles = [
    {
      'parkingBrakeMrk': false,
      'axleNumber': 1
    },
    {
      'parkingBrakeMrk': true,
      'axleNumber': 2
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
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
        StoreModule.forFeature('adrDetails', adrDetailsReducer),
        FontAwesomeModule,
        ReactiveFormsModule,
        NgrxFormsModule,
      ],
      declarations: [TechnicalRecordComponent],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', {a: INITIAL_STATE})),
            select: jest.fn()
          }
        },
        {provide: AuthenticationGuard, useValue: authenticationGuardMock},
        {provide: APP_BASE_HREF, useValue: '/'}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(TechnicalRecordComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    unsubscribe.next();
    unsubscribe.complete();
  });

  it('should create', () => {
    store = TestBed.get(Store);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should toggle panel open state', () => {
    component.togglePanel();
    for (const panel of component.panels) {
      expect(panel.isOpened).toEqual(true);
    }
  });

  it('should check if string empty', () => {
    expect(component.isNullOrEmpty('')).toBeTruthy();
  });

  it('should check if string null', () => {
    expect(component.isNullOrEmpty(null)).toBeTruthy();
  });

  it('should check if string is not empty', () => {
    expect(component.isNullOrEmpty('aaa')).toBeFalsy();
  });

  it('should check if string is not empty', () => {
    expect(component.isNullOrEmpty('aaa')).toBeFalsy();
  });

  it('should check if object is empty', () => {
    expect(component.isEmptyObject({})).toBeTruthy();
  });

  it('should check if object is empty', () => {
    expect(component.isEmptyObject({})).toBeTruthy();
  });

  it('should check if edit action updates variables properly', () => {
    component.adrEdit({}, ['1A', '1B', '2C'], ['Hydrogen', 'Expl (type 2)', 'Expl (type 3)'], false);
    expect(component.changeLabel).toEqual('Save technical record');
    expect(component.isSubmit).toEqual(true);
    expect(component.adrData).toEqual(false);
    expect(component.showCheck).toEqual(true);
    expect(component.numberFee).toEqual(['1A', '1B', '2C']);
    expect(component.dangerousGoods).toEqual(['Hydrogen', 'Expl (type 2)', 'Expl (type 3)']);
    expect(component.isAdrNull).toEqual(false);
  });

  it('should check if axles has no parking brake mrk', () => {
    component.axlesHasNoParkingBrakeMrk(axles);
    for (const axle of axles) {
      if (axle.parkingBrakeMrk === true) {
        expect(component.axlesHasNoParkingBrakeMrk(axles)).toBeFalsy();
      }
    }
  });

  it('should check if cancel action updates variables properly', () => {
    component.cancelAddrEdit();
    expect(component.changeLabel).toEqual('Change technical record');
    expect(component.adrData).toEqual(true);
    expect(component.showCheck).toEqual(false);
    expect(component.isSubmit).toEqual(false);
    expect(component.hideForm).toEqual(false);
  });

  it('should switch ADR display conditionally', () => {
    const customObject = {'currentTarget': {'value': 'true'}};
    component.switchAdrDisplay(customObject as any);

    expect(component.adrData).toEqual(false);
    expect(component.hideForm).toEqual(false);
  });

  it('should add UN', () => {
    const productListOld = (<FormArray>component.adrDetailsForm.get('productListUnNo')).length;
    component.onAddUN();
    const productListNew = (<FormArray>component.adrDetailsForm.get('productListUnNo')).length;
    expect(productListNew).toEqual(productListOld + 1);
  });

  it('should add a guidance note', () => {
    component.addAGuidanceNote('Note');
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should add dangerous good', () => {
    component.addDangerousGood('Good');
    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should add subsequent inspection', () => {
    component.addSubsequentInspection();
    expect(component.subsequentInspection).toEqual(true);
  });

  it('should select reference number change', () => {
    component.selectReferenceNumberChange({currentTarget: {value: 'isStatement'}});
    expect(component.isStatement).toEqual(true);
  });

  it('should not select reference number change', () => {
    component.selectReferenceNumberChange({currentTarget: {value: 'isNotStatement'}});
    expect(component.isStatement).toEqual(false);
  });

  it('should test onBatteryApplicableChange', () => {
    component.onBatteryApplicableChange({currentTarget: {value: 'applicable'}});
    expect(component.isBatteryApplicable).toEqual(true);
  });

  it('should test onBatteryApplicableChange and be false', () => {
    component.onBatteryApplicableChange({currentTarget: {value: 'notApplicable'}});
    expect(component.isBatteryApplicable).toEqual(false);
  });

  it('should test onManufactureBreakChange', () => {
    component.onManufactureBreakChange({currentTarget: {checked: true}});
    expect(component.isBrakeDeclarationsSeen).toEqual(true);
  });

  it('should test onManufactureBreakChange and be false', () => {
    component.onManufactureBreakChange({currentTarget: {checked: false}});
    expect(component.isBrakeDeclarationsSeen).toEqual(false);
  });

  // it('should open modal', () => {
  //   component.onModalShow();
  //   expect(component.matDialog.open).toHaveBeenCalled();
  // });

  it('should track by index', () => {
    const index = component.trackByIndex(23);
    expect(index).toEqual(23);
  });

  it('should track by id', () => {
    const id = component.trackById(12, '23');
    expect(id).toEqual('23');
  });

  it('should add file', () => {
    const oldFiles = component.files.size;
    component.fileChange({target: {files: []}});
    const newFiles = component.files.size;
    expect(newFiles).toEqual(oldFiles);
  });

  // it('should test changeListener', () => {
  //   const oldFiles = component.files.size;
  //   component.changeListener({target: {files: []}});
  //   const newFiles = component.files.size;
  //   expect(newFiles).toEqual(oldFiles + 1);
  // });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
