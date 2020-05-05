import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrakesComponent } from './brakes.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TESTING_UTILS } from '../../utils/testing.utils';

describe('BrakesComponent', () => {
  let component: BrakesComponent;
  let fixture: ComponentFixture<BrakesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ BrakesComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrakesComponent);
    component = fixture.componentInstance;
    component.currentVehicleType = 'trl';
    component.brakes = TESTING_UTILS.mockBrakes();
    fixture.detectChanges();
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });
});
