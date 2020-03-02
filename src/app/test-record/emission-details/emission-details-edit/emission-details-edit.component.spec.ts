import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmissionDetailsEditComponent } from './emission-details-edit.component';
import { TestType } from '@app/models/test.type';
import { EMISSION_STANDARD, FUEL_TYPE, MOD_TYPE } from '@app/test-record/test-record.enums';
import { FormGroup, FormGroupDirective } from '@angular/forms';
import { TESTING_UTILS } from '@app/utils/testing.utils';

describe('EmissionDetailsEditComponent', () => {
  let component: EmissionDetailsEditComponent;
  let fixture: ComponentFixture<EmissionDetailsEditComponent>;
  const testTypeGroup = new FormGroup({ testType: new FormGroup({}) });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmissionDetailsEditComponent],
      providers: [
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
    component.testTypeGroup = testTypeGroup;
    component.editModTypeUsed = true;
    component.editParticulate = true;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('ngOnInit', () => {
    component.ngOnInit();
    component.testTypeGroup = testTypeGroup;
    spyOn(component.testTypeGroup, 'addControl');
    expect(component.testResultChildForm).toBeDefined();
    expect(!!component.testTypeGroup).toEqual(true);
  });
});

