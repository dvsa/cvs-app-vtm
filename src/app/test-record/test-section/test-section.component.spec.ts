import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSectionComponent } from './test-section.component';
import {SharedModule} from '@app/shared/shared.module';
import {TechRecordHelpersService} from '@app/technical-record/tech-record-helpers.service';
import {TestType} from '@app/models/test.type';
import {TestResultModel} from '@app/models/test-result.model';

describe('TestSectionComponent', () => {
  let component: TestSectionComponent;
  let fixture: ComponentFixture<TestSectionComponent>;
  const testType = {testTypeId: '1'} as TestType;
  const testRecord = {} as TestResultModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule ],
      providers: [
        TechRecordHelpersService
      ],
      declarations: [ TestSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSectionComponent);
    component = fixture.componentInstance;
    component.testType = testType;
    component.testRecord = testRecord;
    component.applicableTestTypeIds1 = { 43: 'test' };
    component.applicableTestTypeIds2 = { 43: 'test' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
