import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, getTestBed} from '@angular/core/testing';
import {TechnicalRecordComponent} from './technical-record.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {APP_BASE_HREF} from '@angular/common';
import {AuthenticationGuard} from 'microsoft-adal-angular6';
import {MatDialogModule} from '@angular/material/dialog';
import {MaterialModule} from '../../material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthenticationGuardMock} from '../../../../test-config/services-mocks/authentication-guard.mock';
import {Store, StoreModule} from '@ngrx/store';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedModule} from '../../shared/shared.module';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {Subject} from 'rxjs';
import { IAppState, INITIAL_STATE } from '@app/store/state/adrDetailsForm.state';
import { appReducers } from '@app/store/reducers/app.reducers';
import { adrDetailsReducer } from '@app/store/reducers/adrDetailsForm.reducer';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgrxFormsModule } from 'ngrx-forms';
import { hot } from 'jasmine-marbles';

describe('TechnicalRecordComponent', () => {

  let component: TechnicalRecordComponent;
  let fixture: ComponentFixture<TechnicalRecordComponent>;
  const authenticationGuardMock = new AuthenticationGuardMock();
  const unsubscribe = new Subject<void>();
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
        StoreModule.forFeature('adrDetails', adrDetailsReducer),
        FormsModule,
        SharedModule,
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

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should toggle panel open state', () => {
    component.togglePanel();
    for (const panel of component.panels) {
      expect(panel.isOpened).toEqual(true);
    }
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
