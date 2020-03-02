import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSectionComponent } from './test-section.component';
import { SharedModule } from '@app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TESTING_TEST_MODELS_UTILS } from '@app/utils/testing-test-models.utils';

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
    component.testType = TESTING_TEST_MODELS_UTILS.mockTestType();
    component.testRecord = TESTING_TEST_MODELS_UTILS.mockTestRecord();
    component.applicableTestTypeIds1 = { 43: 'test' };
    component.applicableTestTypeIds2 = { 43: 'test' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
