import {async, ComponentFixture, TestBed, getTestBed} from '@angular/core/testing';
import {AdrDetailsFormComponent} from './adr-details-form.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {MatDialogModule} from '@angular/material/dialog';
import {RouterTestingModule} from '@angular/router/testing';
import {Store, StoreModule, INITIAL_STATE} from '@ngrx/store';
import {AuthenticationGuard, MsAdalAngular6Module} from 'microsoft-adal-angular6';
import {APP_BASE_HREF} from '@angular/common';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Subject, of} from 'rxjs';
import {appReducers} from '@app/store/reducers/app.reducers';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormGroupState, NgrxFormsModule} from 'ngrx-forms';
import {cold, hot} from 'jasmine-marbles';
import {IAppState} from '@app/store/state/app.state';
import {MaterialModule} from '@app/material.module';
import {SharedModule} from '@app/shared/shared.module';
import {AuthenticationGuardMock} from '../../../../../testconfig/services-mocks/authentication-guard.mock';
import {adrDetailsReducer} from '@app/technical-record/adr-details/adr-details-form/store/adrDetails.reducer';
import {
  CreateGuidanceNoteElementAction,
  CreatePermittedDangerousGoodElementAction,
  DownloadDocumentFileAction
} from '@app/technical-record/adr-details/adr-details-form/store/adrDetails.actions';

describe('TechnicalRecordSearchComponent', () => {

  let component: AdrDetailsFormComponent;
  let fixture: ComponentFixture<AdrDetailsFormComponent>;
  const authenticationGuardMock = new AuthenticationGuardMock();
  const unsubscribe = new Subject<void>();
  let store: Store<IAppState>;
  let injector: TestBed;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdrDetailsFormComponent],
      imports: [
        MsAdalAngular6Module.forRoot({
          tenant: '1x111x11-1xx1-1xxx-xx11-1x1xx11x1111',
          clientId: '11x111x1-1xx1-1111-1x11-x1xx111x11x1',
          redirectUri: window.location.origin,
          endpoints: {
            'https://localhost/Api/': 'xxx-xxx1-1111-x111-xxx'
          },
          navigateToLoginRequestUrl: true,
          cacheLocation: 'localStorage',
        }),
        StoreModule.forRoot(appReducers),
        HttpClientTestingModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        SharedModule,
        RouterTestingModule,
        StoreModule.forFeature('adrDetails', adrDetailsReducer),
        FontAwesomeModule,
        ReactiveFormsModule,
        NgrxFormsModule
      ],
      providers: [
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', {a: INITIAL_STATE})),
            filter: jest.fn(),
            select: jest.fn()
          }
        },
        {provide: AuthenticationGuard, useValue: authenticationGuardMock},
        {provide: APP_BASE_HREF, useValue: '/'},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(AdrDetailsFormComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    component.permittedDangerousGoodsFe$ = of(['true']);
    component.guidanceNotesFe$ = of(['true']);
    component.fileInputVariable = {nativeElement: {value : 'test'}};
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    unsubscribe.next();
    unsubscribe.complete();
  });

  it('should create', () => {
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(AdrDetailsFormComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    component.permittedDangerousGoodsFe$ = of(['true']);
    component.guidanceNotesFe$ = of(['true']);
    component.fileInputVariable = {nativeElement: {value : 'test'}};
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should dispatch create guidance note element action', () => {
    const note = 'test';
    spyOn(store, 'dispatch');
    component.addAGuidanceNote(note);
    expect(store.dispatch).toHaveBeenCalledWith(new CreateGuidanceNoteElementAction(note, false));
  });

  it('should dispatch create permitted dangerous good action', () => {
    const good = 'test';
    spyOn(store, 'dispatch');
    component.addDangerousGood(good);
    expect(store.dispatch).toHaveBeenCalledWith(new CreatePermittedDangerousGoodElementAction(good, false));
  });

  it('should dispatch download action', () => {
    const doc = 'test';
    spyOn(store, 'dispatch');
    component.downloadDocument(doc);
    expect(store.dispatch).toHaveBeenCalledWith(new DownloadDocumentFileAction(doc));
  });

  it('should change isStatement value', () => {
    const event = {currentTarget: {value: 'isStatement'}};
    component.selectReferenceNumberChange(event);
    expect(component.isStatement).toBeTruthy();
  });

  it('should change isBatteryApplicable value', () => {
    const event = {currentTarget: {value: 'applicable'}};
    component.onBatteryApplicableChange(event);
    expect(component.isBatteryApplicable).toBeTruthy();
  });

  it('should change isBrakeDeclarationsSeen value', () => {
    const event = {currentTarget: {checked: true}};
    component.onManufactureBreakChange(event);
    expect(component.isBrakeDeclarationsSeen).toBeTruthy();
  });

  it('should change isBrakeDeclarationsSeen value', () => {
    const event = {currentTarget: {checked: false}};
    component.onManufactureBreakChange(event);
    expect(component.isBrakeDeclarationsSeen).toBeFalsy();
  });

  it('should change isBrakeEndurance value', () => {
    const event = {currentTarget: {checked: true}};
    component.onBrakeEnduranceChange(event);
    expect(component.isBrakeEndurance).toBeTruthy();
  });

  it('should change isBrakeEndurance value', () => {
    const event = {currentTarget: {checked: false}};
    component.onBrakeEnduranceChange(event);
    expect(component.isBrakeEndurance).toBeFalsy();
  });

  it('should return false if type not string', () => {
    expect(component.isNullOrEmpty(3)).toBeFalsy();
  });

  it('should check if string null', () => {
    expect(component.isNullOrEmpty(null)).toBeTruthy();
  });

  it('should check if string not empty', () => {
    const str = 'asasdasd';
    expect(component.isNullOrEmpty(str)).toBeFalsy();
  });

  it('should check if empty string', () => {
    const str = '';
    expect(component.isNullOrEmpty(str)).toBeTruthy();
  });

  it('should check if empty object', () => {
    const object = {};
    expect(component.isEmptyObject(object)).toBeTruthy();
  });

  it('should trackById', () => {
    const id = '100';
    expect(component.trackById(1, id)).toEqual('100');
  });

  it('should trackByIndex', () => {
    const index = 12345;
    expect(component.trackByIndex(index)).toEqual(12345);
  });

  it('should trackByFn', () => {
    const item = {'id': '1234'};
    expect(component.trackByFn(item)).toEqual('1234');
  });

});
