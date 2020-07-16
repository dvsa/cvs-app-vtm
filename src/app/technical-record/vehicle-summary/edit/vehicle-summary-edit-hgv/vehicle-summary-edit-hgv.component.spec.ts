import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroupDirective,
  FormGroup,
  AbstractControl
} from '@angular/forms';

import { TESTING_UTILS } from '@app/utils/testing.utils';
import { TechRecord } from '@app/models/tech-record.model';
import { VehicleSummaryEditHgvComponent } from './vehicle-summary-edit-hgv.component';

const mockTechRecord = {
  speedLimiterMrk: true,
  tachoExemptMrk: true,
  euroStandard: 'e2',
  fuelPropulsionSystem: 'DieselPetrol',
  drawbarCouplingFitted: true,
  offRoad: true,
  numberOfWheelsDriven: 4,
  emissionsLimit: null
} as TechRecord;

describe('VehicleSummaryEditHgvComponent', () => {
  let component: VehicleSummaryEditHgvComponent;
  let fixture: ComponentFixture<VehicleSummaryEditHgvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [VehicleSummaryEditHgvComponent],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective({
            techRecord: new FormGroup({}) as AbstractControl
          })
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleSummaryEditHgvComponent);
    component = fixture.componentInstance;
  });

  it('should create with empty control states', () => {
    component.techRecord = {} as TechRecord;
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(component.techRecordFg.get('speedLimiterMrk').value).toBeFalsy();
    expect(component.techRecordFg.get('tachoExemptMrk').value).toBeFalsy();
    expect(component.techRecordFg.get('euroStandard').value).toEqual(null);
    expect(component.techRecordFg.get('fuelPropulsionSystem').value).toEqual(null);
    expect(component.techRecordFg.get('drawbarCouplingFitted').value).toBeFalsy();
    expect(component.techRecordFg.get('offRoad').value).toBeFalsy();
    expect(component.techRecordFg.get('numberOfWheelsDriven').value).toEqual(null);
    expect(component.techRecordFg.get('emissionsLimit').value).toEqual(null);

    expect(fixture).toMatchSnapshot();
  });

  it('should create with initialized form controls', () => {
    component.techRecord = mockTechRecord;
    fixture.detectChanges();

    expect(component.techRecordFg.get('speedLimiterMrk').value).toEqual(
      mockTechRecord.speedLimiterMrk
    );
    expect(component.techRecordFg.get('tachoExemptMrk').value).toEqual(
      mockTechRecord.tachoExemptMrk
    );
    expect(component.techRecordFg.get('euroStandard').value).toEqual(mockTechRecord.euroStandard);
    expect(component.techRecordFg.get('fuelPropulsionSystem').value).toEqual(
      mockTechRecord.fuelPropulsionSystem
    );
    expect(component.techRecordFg.get('fuelPropulsionSystem').value).toEqual(
      mockTechRecord.fuelPropulsionSystem
    );
    expect(component.techRecordFg.get('drawbarCouplingFitted').value).toEqual(
      mockTechRecord.drawbarCouplingFitted
    );
    expect(component.techRecordFg.get('offRoad').value).toEqual(mockTechRecord.offRoad);
    expect(component.techRecordFg.get('numberOfWheelsDriven').value).toEqual(
      mockTechRecord.numberOfWheelsDriven
    );
    expect(component.techRecordFg.get('emissionsLimit').value).toEqual(
      mockTechRecord.emissionsLimit
    );
  });
});
