import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { TechRecordHelpersService } from '@app/technical-record/tech-record-helpers.service';
import { SharedModule } from '@app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VehicleSummaryComponent } from '@app/technical-record/vehicle-summary/vehicle-summary.component';
import { TESTING_UTILS } from '../../utils/testing.utils';
import { BodyType } from '@app/models/body-type';

describe('VehicleSummaryComponent', () => {
  let component: VehicleSummaryComponent;
  let fixture: ComponentFixture<VehicleSummaryComponent>;
  let injector: TestBed;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [VehicleSummaryComponent],
      providers: [TechRecordHelpersService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleSummaryComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    component.activeRecord = TESTING_UTILS.mockTechRecord({
      approvalType: 'approval',
      variantNumber: '123',
      ntaNumber: '4566'
    });
    component.activeRecord.axles = [TESTING_UTILS.mockAxle()];
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should create format the vehicle class description', () => {
    component.activeRecord.vehicleClass = {
      description: 'the first letter needs to be capital'
    } as BodyType;
    fixture.detectChanges();
    expect(component.vehicleClassDescription).toEqual('The first letter needs to be capital');
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
