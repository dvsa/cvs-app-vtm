import { ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { SharedModule } from '@app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestHistoryComponent } from './test-history.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TEST_MODEL_UTILS } from '@app/utils/test-model.utils';

describe('TestHistoryComponent', () => {
  let component: TestHistoryComponent;
  let fixture: ComponentFixture<TestHistoryComponent>;
  let injector: TestBed;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [TestHistoryComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHistoryComponent);
    injector = getTestBed();
    component = fixture.componentInstance;
    const testResult = TEST_MODEL_UTILS.mockTestRecord();
    component.testResultJson = [testResult];
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();
    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
});
