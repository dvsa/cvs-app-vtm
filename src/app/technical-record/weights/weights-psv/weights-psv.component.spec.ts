import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WeightsPsvComponent } from './weights-psv.component';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { TechRecord } from '@app/models/tech-record.model';

describe('PsvWeightsComponent', () => {
  let component: WeightsPsvComponent;
  let fixture: ComponentFixture<WeightsPsvComponent>;
  const techRecordWeights: TechRecord = {
    grossGbWeight: 3,
    grossDesignWeight: 2,
    grossKerbWeight: 3,
    grossLadenWeight: 5,
    unladenWeight: 4,
    axles: [TESTING_UTILS.mockAxle()],
  } as TechRecord;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ WeightsPsvComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightsPsvComponent);
    component = fixture.componentInstance;
  });

  it('should create psv view only with populated data', () => {
    component.activeRecord = TESTING_UTILS.mockTechRecord({
      vehicleType: 'psv',
      ...techRecordWeights
    });

    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });
});
