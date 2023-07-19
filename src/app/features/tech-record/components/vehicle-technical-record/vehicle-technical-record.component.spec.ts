import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiModule } from '@api/test-results';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { mockVehicleTechnicalRecord } from '@mocks/mock-vehicle-technical-record.mock';
import { ReasonForEditing, StatusCodes, TechRecordModel } from '@models/vehicle-tech-record.model';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState, State } from '@store/index';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { createProvisionalTechRecord, updateTechRecords } from '@store/technical-records';
import { of } from 'rxjs';
import { EditTechRecordButtonComponent } from '../edit-tech-record-button/edit-tech-record-button.component';
import { TechRecordHistoryComponent } from '../tech-record-history/tech-record-history.component';
import { TechRecordSummaryComponent } from '../tech-record-summary/tech-record-summary.component';
import { TechRecordTitleComponent } from '../tech-record-title/tech-record-title.component';
import { TestRecordSummaryComponent } from '../test-record-summary/test-record-summary.component';
import { VehicleTechnicalRecordComponent } from './vehicle-technical-record.component';

describe('VehicleTechnicalRecordComponent', () => {
  let component: VehicleTechnicalRecordComponent;
  let fixture: ComponentFixture<VehicleTechnicalRecordComponent>;
  let store: MockStore<State>;

  @Component({})
  class TechRecordSummaryStubComponent {
    checkForms() {}
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ApiModule,
        DynamicFormsModule,
        EffectsModule.forRoot(),
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        RouterTestingModule,
        SharedModule,
        StoreModule.forRoot({})
      ],
      declarations: [
        EditTechRecordButtonComponent,
        TechRecordHistoryComponent,
        TechRecordSummaryComponent,
        TechRecordTitleComponent,
        TechRecordSummaryStubComponent,
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
            get viewableTechRecord$() {
              return of(mockVehicleTechnicalRecord().techRecord[2]);
            },
            updateEditingTechRecord: () => {},
            get editableTechRecord$() {
              return of(mockVehicleTechnicalRecord().techRecord[2]);
            },
            get sectionStates$() {
              return of(['TEST_SECTION']);
            },
            getVehicleTypeWithSmallTrl: (techRecord: TechRecordModel) => {
              return techRecord.vehicleType;
            }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(VehicleTechnicalRecordComponent);
    component = fixture.componentInstance;
    component.vehicle = mockVehicleTechnicalRecord();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should get current vrm', () => {
    fixture.detectChanges();
    expect(component.currentVrm).toEqual('KP01ABC');
  });

  it('should get other Vrms', () => {
    fixture.detectChanges();
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
    component.vehicle.techRecord = component.vehicle.techRecord.filter(record => record.statusCode === StatusCodes.CURRENT);
    fixture.detectChanges();

    component.currentTechRecord$?.subscribe(record => expect(record).toBeTruthy());
  });

  it('should get archived tech record', () => {
    component.vehicle.techRecord = component.vehicle.techRecord.filter(record => record.statusCode === StatusCodes.ARCHIVED);
    fixture.detectChanges();

    component.currentTechRecord$?.subscribe(record => expect(record).toBeTruthy());
  });

  it('should get tech record using created date', () => {
    const expectedDate = new Date();
    store.overrideSelector(selectRouteNestedParams, { techCreatedAt: expectedDate });
    component.vehicle.techRecord[0].createdAt = expectedDate;
    fixture.detectChanges();

    component.currentTechRecord$?.subscribe(record => expect(record).toBeTruthy());
  });

  describe('handleSubmit', () => {
    describe('correcting an error', () => {
      beforeEach(() => {
        component.editingReason = ReasonForEditing.CORRECTING_AN_ERROR;
        fixture.detectChanges();
        component.summary = TestBed.createComponent(TechRecordSummaryStubComponent).componentInstance as TechRecordSummaryComponent;
      });

      it('should update the current for a valid form', fakeAsync(() => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        tick();
        component.handleSubmit();
        expect(dispatchSpy).toHaveBeenCalledWith(updateTechRecords({ systemNumber: component.vehicle.systemNumber }));
      }));
    });

    describe('notifiable alteration', () => {
      beforeEach(() => {
        component.editingReason = ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED;
        fixture.detectChanges();
        component.summary = TestBed.createComponent(TechRecordSummaryStubComponent).componentInstance as TechRecordSummaryComponent;
      });

      it('should dispatch updateTechRecords with oldStatusCode to archive the prosional', fakeAsync(() => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        tick();
        component.handleSubmit();
        expect(dispatchSpy).toHaveBeenCalledWith(
          updateTechRecords({
            systemNumber: component.vehicle.systemNumber,
            recordToArchiveStatus: StatusCodes.PROVISIONAL,
            newStatus: StatusCodes.PROVISIONAL
          })
        );
      }));

      it('should dispatch updateTechRecords to create a new provisional when one isnt present', fakeAsync(() => {
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        //remove provisional
        component.vehicle.techRecord.splice(0, 1);
        tick();
        component.handleSubmit();
        expect(dispatchSpy).toHaveBeenCalledWith(createProvisionalTechRecord({ systemNumber: component.vehicle.systemNumber }));
      }));
    });
  });
});
