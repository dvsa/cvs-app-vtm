import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { BrakesPsvComponent } from './brakes-psv.component';
import { TESTING_UTILS } from '@app/utils/testing.utils';

describe('PsvBrakesComponent', () => {
  let component: BrakesPsvComponent;
  let fixture: ComponentFixture<BrakesPsvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [BrakesPsvComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrakesPsvComponent);
    component = fixture.componentInstance;
    component.brakes = TESTING_UTILS.mockBrakes({
      brakeForceWheelsNotLocked: TESTING_UTILS.mockBrakeForceWheelsNotLocked(),
      brakeForceWheelsUpToHalfLocked: TESTING_UTILS.mockBrakeForceWheelsUpToHalfLocked()
    });

    fixture.detectChanges();
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });
});
