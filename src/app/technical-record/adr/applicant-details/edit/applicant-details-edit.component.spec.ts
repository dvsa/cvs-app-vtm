import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormGroupDirective } from '@angular/forms';

import { SharedModule } from '@app/shared';
import { ApplicantDetailsEditComponent } from './applicant-details-edit.component';
import { ApplicantDetails } from '@app/models/adr-details';
import { TESTING_UTILS } from '@app/utils/testing.utils';

describe('TestComponent', () => {
  let component: TestApplicantDetailsEdit;
  let fixture: ComponentFixture<TestApplicantDetailsEdit>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [ApplicantDetailsEditComponent, TestApplicantDetailsEdit],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective()
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestApplicantDetailsEdit);
    component = fixture.componentInstance;
  });

  fit('should create with initialized form controls', () => {
    component.applicantDetails = TESTING_UTILS.mockApplicantDetails();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'test-applicant-details-edit',
  template: `
    <vtm-applicant-details-edit
      [applicantDetails]="applicantDetails"
    ></vtm-applicant-details-edit>
  `
})
class TestApplicantDetailsEdit {
  applicantDetails: ApplicantDetails;
}
