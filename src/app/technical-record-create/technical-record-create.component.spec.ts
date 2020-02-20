import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '@app/material.module';
import {SharedModule} from '@app/shared/shared.module';

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
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
