import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';

import { DimensionsComponent } from './dimensions.component';
import { TechRecord } from '@app/models/tech-record.model';
import { TESTING_UTILS } from '@app/utils';
import { VEHICLE_TYPES } from '../../app.enums';

describe('DimensionsComponent', () => {
  let component: DimensionsComponent;
  let fixture: ComponentFixture<DimensionsComponent>;

  const getTechRecord = (): TechRecord => {
    return {
      frontAxleToRearAxle: 450,
      frontAxleTo5thWheelMin: 456,
      frontAxleTo5thWheelMax: 660,
      frontAxleTo5thWheelCouplingMin: 100,
      frontAxleTo5thWheelCouplingMax: 150,
      dimensions: TESTING_UTILS.mockDimensions({
        axleSpacing: [
          TESTING_UTILS.mockAxleSpacing({ axles: '1', value: 100 }),
          TESTING_UTILS.mockAxleSpacing({ axles: '2', value: 100 }),
          TESTING_UTILS.mockAxleSpacing({ axles: '3', value: 100 })
        ]
      })
    } as TechRecord;
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [DimensionsComponent, TestDimensionsEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DimensionsComponent);
    component = fixture.componentInstance;
  });

  it('should create view only for hgv with populated data', () => {
    component.activeRecord = {
      ...getTechRecord(),
      vehicleType: VEHICLE_TYPES.HGV
    } as TechRecord;
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should create view only for other vehicles with populated data', () => {
    component.activeRecord = {
      ...getTechRecord(),
      vehicleType: VEHICLE_TYPES.PSV
    } as TechRecord;
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should render the editable component if editState is true', () => {
    component.activeRecord = getTechRecord();
    component.editState = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'vtm-dimensions-edit',
  template: `
    <div>active record is: {{ techRecord | json }}</div>
  `
})
class TestDimensionsEditComponent {
  @Input() techRecord: TechRecord;
}
