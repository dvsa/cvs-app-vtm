import {async, ComponentFixture, getTestBed, TestBed} from '@angular/core/testing';
import {TechRecordHelpersService} from '@app/technical-record/tech-record-helpers.service';
import {SharedModule} from '@app/shared/shared.module';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { WeightsComponent } from './weights.component';

describe('WeightsComponent', () => {

  let component: WeightsComponent;
  let fixture: ComponentFixture<WeightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [
        WeightsComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightsComponent);
    component = fixture.componentInstance;
    component.activeRecord = {
      'vin': 'XMGDE02FS0H012345',
      'vehicleSize': 'small',
      'testStationName': 'Rowe, Wunsch and Wisoky',
      'vehicleId': 'JY58FPP',
      'vehicleType': 'hgv',
      'grossGbWeight': 3,
      'grossDesignWeight': 2,
      'grossEecWeight': 3,
      'trainGbWeight': 900,
      'trainDesignWeight': 900,
      'trainEecWeight': 400,
      'maxTrainGbWeight': 500,
      'maxTrainDesignWeight': 500,
      'maxTrainEecWeight': 500,
      'axles': [
        {
          'axleNumber': 1,
          'weights': {
            'gbWeight': 500,
            'eecWeight': 500,
            'designWeight': 500
          }
        },
        {
          'axleNumber': 2,
          'weights': {
            'gbWeight': 500,
            'eecWeight': 500,
            'designWeight': 500
          }
        }
      ]
    };
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

});
