import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantComponent } from './applicant.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { Applicant } from '../../models/tech-record.model';


describe('ApplicantComponent', () => {
  let component: ApplicantComponent;
  let fixture: ComponentFixture<ApplicantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [
        ApplicantComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantComponent);
    component = fixture.componentInstance;
  });

  it('should create view only with populated data', () => {
    component.applicantDetails = TESTING_UTILS.mockApplicant();
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should have the address1And2 correctly populated', () => {
    component.applicantDetails = {address1: 'someone', address2: 'somewhere' } as Applicant;
    fixture.detectChanges();
    expect(component.address1And2).toEqual('someone somewhere');
  });
});
