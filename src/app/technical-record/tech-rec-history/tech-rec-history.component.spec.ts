import {async, ComponentFixture, fakeAsync, getTestBed, TestBed, tick} from '@angular/core/testing';
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
import {TechRecHistoryComponent} from '@app/technical-record/tech-rec-history/tech-rec-history.component';
import {Router} from '@angular/router';

describe('TechRecHistoryComponent', () => {

  let component: TechRecHistoryComponent;
  let fixture: ComponentFixture<TechRecHistoryComponent>;
  let injector: TestBed;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

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
      declarations: [TechRecHistoryComponent, TechnicalRecordComponent],
      providers: [
        TechRecordHelpersService,
        { provide: Router, useValue: mockRouter},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]

    }).compileComponents();

    fixture = TestBed.createComponent(TechRecHistoryComponent);
    injector = getTestBed();
    mockRouter = TestBed.get(Router);
    component = fixture.componentInstance;
    component.techRecordsJson = [{
      techRecord : [{
        'vin': 'XMGDE02FS0H012345',
        'statusCode': 'aaaa',
        'reasonForCreation': 'bbbb',
        'createdByName': 'dddd',
        'createdAt': 'eeee'
      }]
    }];
    fixture.detectChanges();
  });

  it('should create my component', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should call the action to switch to another technical record', fakeAsync(() => {
    const routes = ['/technical-record', {'id': 8 }];
    component.switchTechRecord(8);
    expect (mockRouter.navigate).toHaveBeenCalled();
    expect (mockRouter.navigate).toHaveBeenCalledWith (routes);
  }));

  afterAll(() => {
    TestBed.resetTestingModule();
  });

});
