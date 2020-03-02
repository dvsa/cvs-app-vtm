import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionDetailsEditComponent } from './emission-details-edit.component';
import { CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { TestType } from '@app/models/test.type';
import { EMISSION_STANDARD, FUEL_TYPE, MOD_TYPE } from '@app/test-record/test-record.enums';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { TESTING_UTILS } from '@app/utils/testing.utils';

describe('EmissionDetailsEditComponent', () => {
  let component: EmissionDetailsEditComponent;
  let fixture: ComponentFixture<EmissionDetailsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmissionDetailsEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective()
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmissionDetailsEditComponent);
    component = fixture.componentInstance;
    component.testType = {} as TestType;
    component.emissionStandardOptions = Object.values(EMISSION_STANDARD);
    component.fuelTypeOptions = Object.values(FUEL_TYPE);
    component.modTypeOptions = Object.values(MOD_TYPE);
    component.testTypeGroup = new FormGroup({ modType: new FormControl('') });
    component.editModTypeUsed = true;
    component.editParticulate = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
