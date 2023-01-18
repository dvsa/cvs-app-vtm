import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiModule as TestResultsApiModule } from '@api/test-results';
import { ReasonForEditing, StatusCodes } from '@models/vehicle-tech-record.model';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SharedModule } from '@shared/shared.module';
import { initialAppState, State } from '@store/.';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { TechRecordSummaryComponent } from '../tech-record-summary/tech-record-summary.component';
import { TestRecordSummaryComponent } from '../test-record-summary/test-record-summary.component';
import { VehicleTechnicalRecordComponent } from './vehicle-technical-record.component';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { TechRecordHistoryComponent } from '../tech-record-history/tech-record-history.component';
import { UserService } from '@services/user-service/user-service';
import { of } from 'rxjs';
import { EditTechRecordButtonComponent } from '../edit-tech-record-button/edit-tech-record-button.component';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { APP_BASE_HREF } from '@angular/common';
import { createProvisionalTechRecord, updateTechRecords } from '@store/technical-records';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { TechRecordTitleComponent } from '../tech-record-title/tech-record-title.component';

describe('VehicleTechnicalRecordComponent', () => {
  let component: VehicleTechnicalRecordComponent;
  let fixture: ComponentFixture<VehicleTechnicalRecordComponent>;
  let store: MockStore<State>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DynamicFormsModule,
        EffectsModule.forRoot(),
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        RouterTestingModule,
        SharedModule,
        StoreModule.forRoot({}),
        TestResultsApiModule
      ],
      declarations: [
        EditTechRecordButtonComponent,
        TechRecordHistoryComponent,
        TechRecordSummaryComponent,
        TechRecordTitleComponent,
        TestRecordSummaryComponent,
        VehicleTechnicalRecordComponent
      ],
      providers: [
        MultiOptionsService,
        provideMockStore({ initialState: initialAppState }),
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: UserService,
          useValue: {
            roles$: of(['TestResult.View', 'TestResult.CreateContingency'])
          }
        },
        {
          provide: TechnicalRecordService,
          useValue: {
            viewableTechRecord$: () => of(mockVehicleTechnicalRecord().techRecord[2]),
            updateEditingTechRecord: () => {}
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(VehicleTechnicalRecordComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get current vrm', () => {
    fixture.detectChanges();
    component.vehicleTechRecord = mockVehicleTechnicalRecord();
    expect(component.currentVrm).toEqual('KP01 ABC');
  });

  it('should get other Vrms', () => {
    fixture.detectChanges();
    component.vehicleTechRecord = mockVehicleTechnicalRecord();
    expect(component.otherVrms).toEqual([
      {
        vrm: '609859Z',
        isPrimary: false
      },
      {
        vrm: '609959Z',
        isPrimary: false
      }
    ]);
  });

  it('should get current tech record', () => {
    component.vehicleTechRecord = mockVehicleTechnicalRecord();
    component.vehicleTechRecord.techRecord = component.vehicleTechRecord.techRecord.filter(record => record.statusCode === StatusCodes.CURRENT);
    fixture.detectChanges();

    component.currentTechRecord$?.subscribe(record => expect(record).toBeTruthy());
  });

  it('should get archived tech record', () => {
    component.vehicleTechRecord = mockVehicleTechnicalRecord();
    component.vehicleTechRecord.techRecord = component.vehicleTechRecord.techRecord.filter(record => record.statusCode === StatusCodes.ARCHIVED);
    fixture.detectChanges();

    component.currentTechRecord$?.subscribe(record => expect(record).toBeTruthy());
  });

  it('should get tech record using created date', () => {
    const expectedDate = new Date();
    store.overrideSelector(selectRouteNestedParams, { techCreatedAt: expectedDate });
    component.vehicleTechRecord = mockVehicleTechnicalRecord();
    component.vehicleTechRecord.techRecord[0].createdAt = expectedDate;
    fixture.detectChanges();

    component.currentTechRecord$?.subscribe(record => expect(record).toBeTruthy());
  });

  describe('handleSubmit', () => {
    it('should evaluate form validity', () => {
      const handleFormStateSpy = jest.spyOn(component, 'handleFormState');
      component.vehicleTechRecord = mockVehicleTechnicalRecord();
      fixture.detectChanges();

      component.isEditing = true;
      component.handleSubmit();

      expect(handleFormStateSpy).toHaveBeenCalled();
      expect(component.isInvalid).toBeTruthy();
      expect(component.isDirty).toBeFalsy();
    });

    describe('correcting an error', () => {
      beforeEach(() => {
        component.editingReason = ReasonForEditing.CORRECTING_AN_ERROR;
        component.handleFormState = jest.fn(() => (component.isInvalid = false));
        fixture.detectChanges();
      });

      it('should update the current for a valid form', fakeAsync(() => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        component.vehicleTechRecord = mockVehicleTechnicalRecord();
        tick();
        component.handleSubmit();
        expect(dispatchSpy).toHaveBeenCalledWith(updateTechRecords({ systemNumber: component.vehicleTechRecord.systemNumber }));
      }));
    });

    describe('notifiable alteration', () => {
      beforeEach(() => {
        component.editingReason = ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED;
        component.handleFormState = jest.fn(() => (component.isInvalid = false));
        fixture.detectChanges();
      });

      it('should dispatch updateTechRecords with oldStatusCode to archive the prosional', fakeAsync(() => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        component.vehicleTechRecord = mockVehicleTechnicalRecord();
        tick();
        component.handleSubmit();
        expect(dispatchSpy).toHaveBeenCalledWith(
          updateTechRecords({
            systemNumber: component.vehicleTechRecord.systemNumber,
            recordToArchiveStatus: StatusCodes.PROVISIONAL,
            newStatus: StatusCodes.PROVISIONAL
          })
        );
      }));

      it('should dispatch updateTechRecords to create a new provisional when one isnt present', fakeAsync(() => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        component.vehicleTechRecord = mockVehicleTechnicalRecord();
        //remove provisional
        component.vehicleTechRecord.techRecord.splice(0, 1);
        tick();
        component.handleSubmit();
        expect(dispatchSpy).toHaveBeenCalledWith(createProvisionalTechRecord({ systemNumber: component.vehicleTechRecord.systemNumber }));
      }));
    });
  });
});
