import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';

import { ApplicantComponent } from './applicant.component';
import { SharedModule } from '@app/shared/shared.module';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { Applicant, TechRecord } from '../../models/tech-record.model';

describe('ApplicantComponent', () => {
  let fixture: ComponentFixture<TestApplicantComponent>;
  let component: TestApplicantComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [ApplicantComponent, TestApplicantComponent, TestApplicantEditComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestApplicantComponent);
    component = fixture.componentInstance;
    component.activeRecord = {
      applicantDetails: TESTING_UTILS.mockApplicant()
    } as TechRecord;
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should render the edit components when editState is true', () => {
    component.editState = true;
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});

@Component({
  selector: 'test-vtm-applicant',
  template: `
    <vtm-applicant [techRecord]="activeRecord" [editState]="editState"> </vtm-applicant>
  `
})
class TestApplicantComponent {
  activeRecord: TechRecord;
  editState: boolean;
}

@Component({
  selector: 'vtm-applicant-edit',
  template: `
    <div>Applicant details is: {{ applicant | json }}</div>
  `
})
class TestApplicantEditComponent {
  @Input() applicant: Applicant;
}
