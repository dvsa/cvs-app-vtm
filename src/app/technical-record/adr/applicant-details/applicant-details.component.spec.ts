import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantDetailsComponent } from './applicant-details.component';
import { SharedModule } from '@app/shared';
import { ApplicantDetails } from '@app/models/adr-details';
import { TESTING_UTILS } from '@app/utils/testing.utils';

describe('TestComponent', () => {
  let component: TestApplicantDetails;
  let fixture: ComponentFixture<TestApplicantDetails>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ApplicantDetailsComponent, TestApplicantDetails],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestApplicantDetails);
    component = fixture.componentInstance;
    component.edit = false;
  });

  it('should create', () => {
    component.applicantDetails = {} as ApplicantDetails;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('should create view only with populated data', () => {
    component.applicantDetails = TESTING_UTILS.mockApplicantDetails();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should render the editable component if edit is true', () => {
    component.edit = true;
    component.applicantDetails = TESTING_UTILS.mockApplicantDetails();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'test-applicant-details',
  template: `
    <vtm-applicant-details
      [edit]="edit"
      [applicantDetails]="applicantDetails"
    ></vtm-applicant-details>
  `
})
class TestApplicantDetails {
  edit: boolean;
  applicantDetails: ApplicantDetails;
}
