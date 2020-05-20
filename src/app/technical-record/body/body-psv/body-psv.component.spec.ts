import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { SharedModule } from '@app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TESTING_UTILS } from '../../../utils/testing.utils';
import { BodyPsvComponent } from './body-psv.component';
import { TechRecord } from '@app/models/tech-record.model';

describe('PsvBodyComponent', () => {
  let component: BodyPsvComponent;
  let fixture: ComponentFixture<BodyPsvComponent>;
  let injector: TestBed;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [BodyPsvComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BodyPsvComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    component.activeRecord = TESTING_UTILS.mockTechRecord({
      vehicleType: 'psv',
      bodyMake: 'test',
      bodyModel: 'test',
      modelLiteral: 'test',
      chassisMake: 'volvo',
      chassisModel: 't23'
    });
    
    fixture.detectChanges();
  });

  it('should create view only with populated data', () => {

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
