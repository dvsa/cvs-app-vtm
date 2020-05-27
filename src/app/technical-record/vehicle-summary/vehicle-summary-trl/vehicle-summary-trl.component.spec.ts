import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSummaryTrlComponent } from './vehicle-summary-trl.component';
import { SharedModule } from '@app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { TechRecord } from '@app/models/tech-record.model';

describe('VehicleSummaryTrlComponent', () => {
  let component: VehicleSummaryTrlComponent;
  let fixture: ComponentFixture<VehicleSummaryTrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [VehicleSummaryTrlComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleSummaryTrlComponent);
    component = fixture.componentInstance;
    component.activeRecord = {
      vehicleType: 'trl',
      firstUseDate: '23122019',
      suspensionType: 'type',
      couplingType: 'type',
      maxLoadOnCoupling: 23,
      frameDescription: 'none',
      roadFriendly: true
    } as TechRecord;
  }));

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });
});
