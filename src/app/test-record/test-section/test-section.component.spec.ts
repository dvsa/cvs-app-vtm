import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSectionComponent } from './test-section.component';
import { SharedModule } from '@app/shared/shared.module';
import { TestType } from '@app/models/test.type';
import { TestResultModel } from '@app/models/test-result.model';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TEST_MODEL_UTILS } from '@app/utils/test-model.utils';
import { TEST_TYPE_APPLICABLE_UTILS } from '@app/utils/test-type-applicable-models.utils';



describe('TestSectionComponent', () => {
  let component: TestSectionComponent;
  let fixture: ComponentFixture<TestSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [TestSectionComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSectionComponent);
    component = fixture.componentInstance;
    component.testType = TEST_MODEL_UTILS.mockTestType();
    component.testRecord = TEST_MODEL_UTILS.mockTestRecord();
    component.testTypesApplicable = TEST_TYPE_APPLICABLE_UTILS.mockTestTypesApplicable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
