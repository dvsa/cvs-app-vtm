import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmissionDetailsComponent } from './emission-details.component';
import { SharedModule } from '@app/shared/shared.module';
import { TestType } from '@app/models/test.type';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TESTING_TEST_MODELS_UTILS } from '@app/utils/testing-test-models.utils';

describe('EmissionDetailsComponent', () => {
  let component: EmissionDetailsComponent;
  let fixture: ComponentFixture<EmissionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [EmissionDetailsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmissionDetailsComponent);
    component = fixture.componentInstance;
    component.testType = TESTING_TEST_MODELS_UTILS.mockTestType();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
