import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiModule } from '@api/test-results';
import { DynamicFormsModule } from '@forms/dynamic-forms.module';
import { MultiOptionsService } from '@forms/services/multi-options.service';
import { ReasonForEditing, StatusCodes, TechRecordModel, V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { SharedModule } from '@shared/shared.module';
import { initialAppState, State } from '@store/index';
import { of } from 'rxjs';
import { EditTechRecordButtonComponent } from '../edit-tech-record-button/edit-tech-record-button.component';
import { TechRecordHistoryComponent } from '../tech-record-history/tech-record-history.component';
import { TechRecordSummaryComponent } from '../tech-record-summary/tech-record-summary.component';
import { TechRecordTitleComponent } from '../tech-record-title/tech-record-title.component';
import { TestRecordSummaryComponent } from '../test-record-summary/test-record-summary.component';
import { VehicleTechnicalRecordComponent } from './vehicle-technical-record.component';
import { updateTechRecord } from '@store/technical-records';

describe('VehicleTechnicalRecordComponent', () => {
  let component: VehicleTechnicalRecordComponent;
  let fixture: ComponentFixture<VehicleTechnicalRecordComponent>;
  let store: MockStore<State>;
  let techRecord: V3TechRecordModel;

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
              return of({ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', techRecord_statusCode: StatusCodes.CURRENT });
            },
            updateEditingTechRecord: () => {},
            get editableTechRecord$() {
              return of({ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' });
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
    component.vehicle = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' };
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // TODO V3 I don't think this is needed anymore
  // it('should get current tech record', () => {
  //   component.vehicle = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', techRecord_statusCode: StatusCodes.CURRENT };
  //   fixture.detectChanges();

  //   component.currentTechRecord$?.subscribe(record => expect(record).toBeTruthy());
  // });

  // it('should get archived tech record', () => {
  //   component.vehicle.techRecord = component.vehicle.techRecord.filter(record => record.statusCode === StatusCodes.ARCHIVED);
  //   fixture.detectChanges();

  //   component.currentTechRecord$?.subscribe(record => expect(record).toBeTruthy());
  // });

  // it('should get tech record using created date', () => {
  //   const expectedDate = new Date();
  //   store.overrideSelector(selectRouteNestedParams, { techCreatedAt: expectedDate });
  //   component.vehicle.techRecord[0].createdAt = expectedDate;
  //   fixture.detectChanges();

  //   component.currentTechRecord$?.subscribe(record => expect(record).toBeTruthy());
  // });

  describe('handleSubmit', () => {
    describe('correcting an error', () => {
      beforeEach(() => {
        component.editingReason = ReasonForEditing.CORRECTING_AN_ERROR;
        fixture.detectChanges();
        component.summary = TestBed.createComponent(TechRecordSummaryStubComponent).componentInstance as TechRecordSummaryComponent;
        techRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' };
      });
      it('should update the current for a valid form', fakeAsync(() => {
        const storeSpy = jest.spyOn(store, 'select').mockReturnValue(of(techRecord));

        const dispatchSpy = jest.spyOn(store, 'dispatch');
        tick();
        component.handleSubmit();
        expect(dispatchSpy).toHaveBeenCalledWith(updateTechRecord({ vehicleTechRecord: techRecord }));
      }));
    });
    describe('notifiable alteration', () => {
      beforeEach(() => {
        component.editingReason = ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED;
        fixture.detectChanges();
        component.summary = TestBed.createComponent(TechRecordSummaryStubComponent).componentInstance as TechRecordSummaryComponent;
        techRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' };
      });
      it('should dispatch updateTechRecords with editingTechRecord unchanged', fakeAsync(() => {
        const storeSpy = jest.spyOn(store, 'select').mockReturnValue(of(techRecord));
        component.recordHistory = [{ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', techRecord_statusCode: StatusCodes.PROVISIONAL }];
        const dispatchSpy = jest.spyOn(store, 'dispatch');
        tick();
        component.handleSubmit();
        expect(dispatchSpy).toHaveBeenCalledWith(updateTechRecord({ vehicleTechRecord: techRecord }));
      }));
      it('should dispatch updateTechRecords to create a new provisional when one isnt present', fakeAsync(() => {
        const storeSpy = jest.spyOn(store, 'select').mockReturnValue(of(techRecord));
        component.recordHistory = [{ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', techRecord_statusCode: StatusCodes.ARCHIVED }];
        const dispatchSpy = jest.spyOn(store, 'dispatch');

        tick();
        component.handleSubmit();
        expect(dispatchSpy).toHaveBeenCalledWith(
          updateTechRecord({ vehicleTechRecord: { ...techRecord, techRecord_statusCode: StatusCodes.PROVISIONAL } })
        );
      }));
    });
  });
});
