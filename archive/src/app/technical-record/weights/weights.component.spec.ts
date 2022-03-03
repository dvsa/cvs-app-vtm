import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { WeightsComponent } from './weights.component';
import { TESTING_UTILS } from '../../utils/testing.utils';
import { TechRecord } from '../../models/tech-record.model';

describe('WeightsComponent', () => {
  let component: WeightsComponent;
  let fixture: ComponentFixture<WeightsComponent>;
  const techRecordWeights: TechRecord = {
    grossGbWeight: 3,
    grossDesignWeight: 2,
    grossEecWeight: 3,
    axles: [TESTING_UTILS.mockAxle()]
  } as TechRecord;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [WeightsComponent, TestWeightsEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightsComponent);
    component = fixture.componentInstance;
  });

  it('should create trl view only with populated data', () => {
    component.activeRecord = TESTING_UTILS.mockTechRecord({
      vehicleType: 'trl',
      ...techRecordWeights
    });

    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should create hgv view only with populated data', () => {
    component.activeRecord = TESTING_UTILS.mockTechRecord({
      vehicleType: 'hgv',
      trainGbWeight: 2,
      trainDesignWeight: 20,
      ...techRecordWeights
    });
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should render the editable component if editState is true', () => {
    component.editState = true;
    component.activeRecord = techRecordWeights;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'vtm-weights-edit',
  template: `
    <div>active record is: {{ techRecord | json }}</div>
  `
})
class TestWeightsEditComponent {
  @Input() techRecord: TechRecord;
}
