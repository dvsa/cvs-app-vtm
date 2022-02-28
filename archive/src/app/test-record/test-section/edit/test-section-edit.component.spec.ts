import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSectionEditComponent } from './test-section-edit.component';
import { SharedModule } from '@app/shared/shared.module';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import {
  REASON_FOR_ABANDONING_HGV_TRL,
  REASON_FOR_ABANDONING_PSV
} from '@app/test-record/test-record.enums';
import { TEST_TYPE_APPLICABLE_UTILS } from '@app/utils/test-type-applicable-models.utils';
import { TEST_MODEL_UTILS } from '@app/utils';

describe('TestSectionEditComponent', () => {
  let component: TestSectionEditComponent;
  let fixture: ComponentFixture<TestSectionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule, ReactiveFormsModule],
      declarations: [TestSectionEditComponent],
      providers: [
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective()
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSectionEditComponent);
    component = fixture.componentInstance;
    component.testRecord = TEST_MODEL_UTILS.mockTestRecord();
    component.testType = TEST_MODEL_UTILS.mockTestType({
      testResult: 'pass',
      testTypeStartTimestamp: '22-11-2019',
      testTypeEndTimestamp: '22-11-2019'
    });
    component.testTypesApplicable = TEST_TYPE_APPLICABLE_UTILS.mockTestTypesApplicable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
    expect(component.isAbandoned).toEqual(false);
    expect(component.reasonsForAbandoning).toEqual(Object.values(REASON_FOR_ABANDONING_HGV_TRL));
    expect(fixture).toMatchSnapshot();
  });

  it('should update isAbandoned based on test result value', () => {
    component.testType = TEST_MODEL_UTILS.mockTestType({ testResult: 'abandoned' });
    fixture.detectChanges();
    expect(component.isAbandoned).toEqual(true);
  });

  it('should update the reasons for abandoning based on vehicle type', () => {
    component.testRecord = TEST_MODEL_UTILS.mockTestRecord({ vehicleType: 'psv' });
    fixture.detectChanges();
    expect(component.reasonsForAbandoning).toEqual(Object.values(REASON_FOR_ABANDONING_PSV));
  });
});
