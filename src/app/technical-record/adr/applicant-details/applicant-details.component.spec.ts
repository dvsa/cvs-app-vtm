import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantDetailsComponent } from './applicant-details.component';
import { SharedModule } from '@app/shared';
import { ApplicantDetails } from '@app/models/adr-details';
import { TESTING_UTILS } from '@app/utils/testing.utils';

describe('ApplicantDetailsComponent', () => {
  let component: ApplicantDetailsComponent;
  let fixture: ComponentFixture<ApplicantDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ApplicantDetailsComponent, TestApplicantDetailsEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create view only with populated data', () => {
    component.edit = false;
    component.applicantDetails = TESTING_UTILS.mockApplicantDetails();
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should render the editable component if edit is true', () => {
    component.edit = true;
    component.applicantDetails = { name: 'Robert Greenn' } as ApplicantDetails;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'vtm-applicant-details-edit',
  template: `
    <div>{{ applicantDetails | json }}</div>
  `
})
class TestApplicantDetailsEditComponent {
  @Input() applicantDetails: ApplicantDetails;
}
