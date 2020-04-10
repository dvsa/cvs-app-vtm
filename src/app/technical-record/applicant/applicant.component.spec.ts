import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantComponent } from './applicant.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TESTING_UTILS } from '@app/utils/testing.utils';


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
    component.applicantDetails = TESTING_UTILS.mockApplicant();
  });

  it('should create view only with populated data', () => {
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });
});
