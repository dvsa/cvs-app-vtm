import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, getTestBed} from '@angular/core/testing';
import {TechnicalRecordComponent} from './technical-record.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {APP_BASE_HREF} from '@angular/common';
import {AuthenticationGuard} from 'microsoft-adal-angular6';
import {MatDialogModule} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Store, StoreModule} from '@ngrx/store';
import {RouterTestingModule} from '@angular/router/testing';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {Subject} from 'rxjs';
// import { IAppState, INITIAL_STATE } from '@app/store/state/adrDetailsForm.state';
import { appReducers } from '@app/store/reducers/app.reducers';
// import { adrDetailsReducer } from '@app/store/reducers/adrDetailsForm.reducer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgrxFormsModule } from 'ngrx-forms';
import { hot } from 'jasmine-marbles';
import { MaterialModule } from '@app/material.module';
import { SharedModule } from '@app/shared/shared.module';
import {AuthenticationGuardMock} from '../../../testconfig/services-mocks/authentication-guard.mock';
import { IAppState } from '@app/store/state/app.state';
import { adrDetailsReducer } from '@app/adr-details-form/store/adrDetails.reducer';
import { INITIAL_STATE } from '@app/adr-details-form/store/adrDetailsForm.state';

describe('TechnicalRecordComponent', () => {

  let component: TechnicalRecordComponent;
  let fixture: ComponentFixture<TechnicalRecordComponent>;
  const authenticationGuardMock = new AuthenticationGuardMock();
  const unsubscribe = new Subject<void>();
  let injector: TestBed;
  let store: Store<IAppState>;
  let axles = [
    { "parkingBrakeMrk": false,
      "axleNumber": 1 },
    { "parkingBrakeMrk": true,
      "axleNumber": 2 }
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
            pipe: jest.fn(() => hot('-a', { a: INITIAL_STATE })),
            select: jest.fn()
          }
        },
        {provide: AuthenticationGuard, useValue: authenticationGuardMock},
        {provide: APP_BASE_HREF, useValue: '/'},
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

  it('should check if object is empty', () => {
    expect(component.isEmptyObject({})).toBeTruthy();
  });

  it('should check if object is empty', () => {
    expect(component.isEmptyObject({})).toBeTruthy();
  });

  it('should check if edit action updates variables properly', () => {
    component.adrEdit({},["1A", "1B", "2C" ], ["Hydrogen", "Expl (type 2)", "Expl (type 3)"], false);
    expect(component.changeLabel).toEqual("Save technical record");
    expect(component.isSubmit).toEqual(true);
    expect(component.adrData).toEqual(false);
    expect(component.showCheck).toEqual(true);
    expect(component.numberFee).toEqual(["1A", "1B", "2C" ]);
    // expect(component.dangerousGoods).toEqual(["Hydrogen", "Expl (type 2)", "Expl (type 3)"]);
    expect(component.isAdrNull).toEqual(false);
  });

  it('should check if axles has no parking brake mrk', () => {
    component.axlesHasNoParkingBrakeMrk(axles);
    for (const axle of axles) {
      if (axle.parkingBrakeMrk === true){
        expect(component.axlesHasNoParkingBrakeMrk(axles)).toBeFalsy();
      }
    }
  });

  it('should check if cancel action updates variables properly', () => {
    component.cancelAddrEdit();
    expect(component.changeLabel).toEqual("Change technical record");
    expect(component.adrData).toEqual(true);
    expect(component.showCheck).toEqual(false);
    expect(component.isSubmit).toEqual(false);
    expect(component.hideForm).toEqual(false);
  });

  it('should switch ADR display conditionally', () => {
    let customObject =  { 'currentTarget' : {'value': 'true'} };
    component.switchAdrDisplay(customObject as any);

    expect(component.adrData).toEqual(false);
    expect(component.hideForm).toEqual(false);
  });



  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
