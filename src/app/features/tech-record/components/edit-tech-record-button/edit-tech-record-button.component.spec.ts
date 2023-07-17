import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RouterService } from '@services/router/router.service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState } from '@store/.';
import { clearError } from '@store/global-error/actions/global-error.actions';
import {
  createProvisionalTechRecordSuccess,
  selectTechRecord,
  selectVehicleTechnicalRecordsBySystemNumber,
  updateEditingTechRecordCancel,
  updateTechRecordsSuccess
} from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { of, ReplaySubject } from 'rxjs';
import { EditTechRecordButtonComponent } from './edit-tech-record-button.component';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

let component: EditTechRecordButtonComponent;
let fixture: ComponentFixture<EditTechRecordButtonComponent>;
let router: Router;
let store: MockStore;
let actions$: ReplaySubject<Action>;
let technicalRecordService: TechnicalRecordService;

const mockRouterService = {
  getRouteNestedParam$: () => '1',
  getRouteDataProperty$: () => false
};

describe('EditTechRecordButtonComponent', () => {
  beforeEach(async () => {
    actions$ = new ReplaySubject<Action>();

    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      declarations: [EditTechRecordButtonComponent],
      providers: [
        { provide: RouterService, useValue: mockRouterService },
        GlobalErrorService,
        provideMockActions(() => actions$),
        provideMockStore({ initialState: initialAppState }),
        { provide: APP_BASE_HREF, useValue: '/' },
        TechnicalRecordService
      ],
      imports: [DynamicFormsModule, HttpClientTestingModule, RouterTestingModule, SharedModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTechRecordButtonComponent);
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    technicalRecordService = TestBed.inject(TechnicalRecordService);

    fixture.detectChanges();

    jest.spyOn(window, 'confirm');
  });

  describe('component', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
