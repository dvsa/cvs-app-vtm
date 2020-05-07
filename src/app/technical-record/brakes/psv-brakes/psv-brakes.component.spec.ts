import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsvBrakesComponent } from './psv-brakes.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TESTING_UTILS } from '../../../utils/testing.utils';

describe('PsvBrakesComponent', () => {
  let component: PsvBrakesComponent;
  let fixture: ComponentFixture<PsvBrakesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [PsvBrakesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsvBrakesComponent);
    component = fixture.componentInstance;
    component.brakes = TESTING_UTILS.mockPSVBrakes();
    fixture.detectChanges();
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });
});
