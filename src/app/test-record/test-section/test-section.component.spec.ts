import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSectionComponent } from './test-section.component';
import { SharedModule } from '@app/shared/shared.module';
import { TechRecordHelpersService } from '@app/technical-record/tech-record-helpers.service';
import { TestType } from '@app/models/test.type';
import { TestResultModel } from '@app/models/test-result.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('TestSectionComponent', () => {
  let component: TestSectionComponent;
  let fixture: ComponentFixture<TestSectionComponent>;
  const testType = {} as TestType;
  const testRecord = {} as TestResultModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [TechRecordHelpersService],
      declarations: [TestSectionComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSectionComponent);
    component = fixture.componentInstance;
    component.testType = testType;
    component.testRecord = testRecord;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
