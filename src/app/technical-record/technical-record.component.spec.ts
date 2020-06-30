import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TechnicalRecordComponent } from './technical-record.component';
import { TechRecordHelperService } from '@app/technical-record/tech-record-helper.service';
import { TechnicalRecordValuesMapper } from './technical-record-value.mapper';

import { TechRecord } from './../models/tech-record.model';
import { MetaData } from '@app/models/meta-data';
import {
  VehicleTechRecordModel,
  VehicleTechRecordEdit
} from '@app/models/vehicle-tech-record.model';
import { TestResultModel } from '@app/models/test-result.model';

//to be moved to TESTING_UTILS
const mockedActiveRecord = {
  bodyType: {
    description: 'other',
    code: 'x'
  },
  createdByName: 'dvsa',
  grossKerbWeight: 2500,
  brakeCode: '178202',
  drawbarCouplingFitted: true,
  notes: 'test note',
  functionCode: 'A',
  lastUpdatedAt: '2019-06-24T10:26:54.903Z',
  brakes: {
    brakeCodeOriginal: '12412',
    brakeCode: '123',
    dtpNumber: '1234',
    loadSensingValve: true,
    brakeForceWheelsNotLocked: {
      parkingBrakeForceA: 2332,
      serviceBrakeForceA: 6424,
      secondaryBrakeForceA: 2512
    },
    retarderBrakeOne: 'electric',
    dataTrBrakeTwo: 'None',
    antilockBrakingSystem: true,
    retarderBrakeTwo: 'exhaust',
    dataTrBrakeOne: 'None',
    brakeForceWheelsUpToHalfLocked: {
      secondaryBrakeForceB: 2512,
      parkingBrakeForceB: 3512,
      serviceBrakeForceB: 5521
    },
    dataTrBrakeThree: 'None'
  },
  conversionRefNo: '7891234',
  grossLadenWeight: 3000,
  axles: [
    {
      axleNumber: 1,
      tyres: {
        speedCategorySymbol: 'a7',
        tyreSize: '295/80-22.5',
        fitmentCode: 'single',
        dataTrAxles: 345,
        plyRating: 'AB',
        tyreCode: 1234
      },
      parkingBrakeMrk: true,
      weights: {
        designWeight: 1800,
        gbWeight: 1400
      }
    },
    {
      axleNumber: 2,
      tyres: {
        speedCategorySymbol: 'a7',
        tyreSize: '295/80-22.5',
        fitmentCode: 'double',
        dataTrAxles: 345,
        plyRating: 'AB',
        tyreCode: 5678
      },
      parkingBrakeMrk: true,
      weights: {
        designWeight: 1900,
        gbWeight: 1600
      }
    }
  ],
  frontAxleTo5thWheelCouplingMin: 1700,
  createdAt: '2019-06-24T10:26:54.903Z',
  maxTrainDesignWeight: 500,
  euroStandard: '9',
  vehicleClass: {
    description: 'heavy goods vehicle',
    code: 'v'
  },
  model: 'FM',
  noOfAxles: 2,
  make: 'Isuzu',
  maxTrainGbWeight: 1000,
  vehicleType: 'hgv',
  speedLimiterMrk: true,
  frontAxleTo5thWheelCouplingMax: 1900,
  recordCompleteness: 'complete',
  vehicleConfiguration: 'semi-car transporter',
  regnDate: '2019-06-25',
  tachoExemptMrk: true,
  frontAxleTo5thWheelMax: 1500,
  ntaNumber: '123456',
  trainGbWeight: 1500,
  reasonForCreation: 'new vehicle1',
  trainDesignWeight: 2000,
  roadFriendly: true,
  tyreUseCode: '2B',
  frontAxleTo5thWheelMin: 1200,
  manufactureYear: 2018,
  dimensions: {
    length: 7500,
    width: 2200
  },
  statusCode: 'current',
  numberOfWheelsDriven: null
};

describe('TechnicalRecordComponent', () => {
  // let component: TechnicalRecordComponent;
  // let fixture: ComponentFixture<TechnicalRecordComponent>;
  let dialog: MatDialog;
  let injector: TestBed;
  //let activeRecord: TechRecord = mockedActiveRecord;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      declarations: [TechnicalRecordComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    injector = getTestBed();
    dialog = injector.get(MatDialog);
    // fixture = TestBed.createComponent(TechnicalRecordComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  // afterEach(() => {
  //   fixture.destroy();
  //   unsubscribe.next();
  //   unsubscribe.complete();
  // });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
