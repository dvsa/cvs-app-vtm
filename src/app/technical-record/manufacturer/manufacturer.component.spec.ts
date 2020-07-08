import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturerComponent } from './manufacturer.component';
import { SharedModule } from '@app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { ManufacturerDetails } from '@app/models/tech-record.model';

describe('ManufacturerComponent', () => {
  let component: ManufacturerComponent;
  let fixture: ComponentFixture<ManufacturerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ManufacturerComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturerComponent);
    component = fixture.componentInstance;
    component.manufacturer = TESTING_UTILS.mockManufacturer();
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should have the address1And2 correctly populated', () => {
    component.manufacturer = TESTING_UTILS.mockManufacturer({
      address1: 'someone',
      address2: 'somewhere'
    });
    fixture.detectChanges();
    expect(component.address1And2).toEqual('someone somewhere');
  });

  it('should render the edit components when editState is true', () => {
    component.editState = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
