import {async, ComponentFixture, getTestBed, TestBed} from '@angular/core/testing';
import { StoreModule} from '@ngrx/store';
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
import {TestHistoryComponent} from '@app/technical-record/test-history/test-history.component';

describe('VehicleSummaryComponent', () => {

  let component: TestHistoryComponent;
  let fixture: ComponentFixture<TestHistoryComponent>;
  let injector: TestBed;

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
      declarations: [TestHistoryComponent, TechnicalRecordComponent],
      providers: [
        TechRecordHelpersService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]

    }).compileComponents();

    fixture = TestBed.createComponent(TestHistoryComponent);
    injector = getTestBed();
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create my component', async(() => {
    expect(component).toBeTruthy();
  }));

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
