import {async, ComponentFixture, getTestBed, TestBed} from '@angular/core/testing';
import {INITIAL_STATE, Store, StoreModule} from '@ngrx/store';
import {TechRecordHelpersService} from '@app/technical-record/tech-record-helpers.service';
import {appReducers} from '@app/store/reducers/app.reducers';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatDialogModule} from '@angular/material/dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '@app/material.module';
import {SharedModule} from '@app/shared/shared.module';
import {RouterTestingModule} from '@angular/router/testing';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgrxFormsModule} from 'ngrx-forms';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TechnicalRecordComponent} from '@app/technical-record/technical-record.component';
import {IAppState} from '@app/store/state/app.state';
import {hot} from 'jasmine-marbles';
import {AdrDetailsComponent} from '@app/technical-record/adr-details/adr-details.component';

describe('AdrDetailsViewComponent', () => {

  let component: AdrDetailsComponent;
  let fixture: ComponentFixture<AdrDetailsComponent>;
  let injector: TestBed;
  let store: Store<IAppState>;

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
        FontAwesomeModule,
        ReactiveFormsModule,
        NgrxFormsModule
      ],
      declarations: [AdrDetailsComponent],
      providers: [
        TechRecordHelpersService,
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
            pipe: jest.fn(() => hot('-a', {a: INITIAL_STATE})),
            filter: jest.fn(),
            select: jest.fn()
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]

    }).compileComponents();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(AdrDetailsComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    component.activeRecord = {
      'vin': 'XMGDE02FS0H012345',
      'vehicleSize': 'small',
      'testStationName': 'Rowe, Wunsch and Wisoky',
      'vehicleId': 'JY58FPP',
      'vehicleType': 'psv',
      'axles': [
        { 'parkingBrakeMrk': false, 'axleNumber': 1 },
        { 'parkingBrakeMrk': true, 'axleNumber': 2 },
        { 'parkingBrakeMrk': false, 'axleNumber': 3 }
      ]
    };

    fixture.detectChanges();
  });

  it('should create my component', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should switch ADR display conditionally', () => {
    const customObject = { 'currentTarget': { 'value': 'true' } };
    component.switchAdrDisplay(customObject as any);

    expect(component.adrData).toEqual(false);
    expect(component.hideForm).toEqual(false);
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
