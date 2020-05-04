import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SharedModule} from '@app/shared/shared.module';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { WeightsComponent } from './weights.component';
import { TESTING_UTILS } from '../../utils/testing.utils';
import { TechRecord } from '../../models/tech-record.model';

describe('WeightsComponent', () => {

  let component: WeightsComponent;
  let fixture: ComponentFixture<WeightsComponent>;
  const techRecordWeights: TechRecord = {
    'grossGbWeight': 3,
    'grossDesignWeight': 2,
    'grossEecWeight': 3,
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
  }as TechRecord;

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
  });

  it('should create trl view only with populated data', () => {
    component.activeRecord = TESTING_UTILS.mockTechRecord({vehicleType: 'trl', ...techRecordWeights});
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should create hgv view only with populated data', () => {
    component.activeRecord = TESTING_UTILS.mockTechRecord({vehicleType: 'hgv', ...techRecordWeights});
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

});
