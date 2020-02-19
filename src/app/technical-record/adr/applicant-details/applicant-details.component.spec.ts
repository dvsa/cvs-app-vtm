import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantDetailsComponent } from './applicant-details.component';
import { SharedModule } from '@app/shared';
import { ApplicantDetails, AdrDetails } from '@app/models/adr-details';
import { TESTING_UTILS } from '@app/utils/testing.utils';

describe('ApplicantDetailsComponent', () => {
  let component: TestApplicantDetailsComponent;
  let fixture: ComponentFixture<TestApplicantDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [
        ApplicantDetailsComponent,
        TestApplicantDetailsComponent,
        TestApplicantDetailsEditComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestApplicantDetailsComponent);
    component = fixture.componentInstance;
    component.adrDetails = TESTING_UTILS.mockAdrDetails();
  });

  it('should create view only with populated data', () => {
    component.edit = false;
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should render the editable component if edit is true', () => {
    component.edit = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'test-vtm-applicant-details',
  template: `
    <vtm-applicant-details [edit]="edit" [adrDetails]="adrDetails"></vtm-applicant-details>
  `
})
class TestApplicantDetailsComponent {
  edit: boolean;
  adrDetails: AdrDetails;
}

@Component({
  selector: 'vtm-applicant-details-edit',
  template: `
    <div>{{ applicantDetails | json }}</div>
  `
})
class TestApplicantDetailsEditComponent {
  @Input() applicantDetails: ApplicantDetails;
}
