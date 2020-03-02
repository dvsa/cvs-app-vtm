import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSectionEditComponent } from './test-section-edit.component';
import { SharedModule } from '@app/shared/shared.module';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormGroupDirective } from '@angular/forms';
import {TESTING_TEST_MODELS_UTILS} from '@app/utils/testing-test-models.utils';

describe('TestSectionEditComponent', () => {
  let component: TestSectionEditComponent;
  let fixture: ComponentFixture<TestSectionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
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
    component.testRecord = TESTING_TEST_MODELS_UTILS.mockTestRecord();
    component.testType = TESTING_TEST_MODELS_UTILS.mockTestType();
    component.applicableTestTypeIds1 = { 43: 'test' };
    component.applicableTestTypeIds2 = { 43: 'test' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
