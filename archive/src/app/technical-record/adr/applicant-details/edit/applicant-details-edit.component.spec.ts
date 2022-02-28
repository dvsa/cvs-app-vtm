import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroupDirective,
  FormGroup,
  AbstractControl
} from '@angular/forms';

import { SharedModule } from '@app/shared';
import { ApplicantDetailsEditComponent } from './applicant-details-edit.component';
import { TESTING_UTILS } from '@app/utils/testing.utils';

describe('ApplicantDetailsEditComponent', () => {
  let component: ApplicantDetailsEditComponent;
  let fixture: ComponentFixture<ApplicantDetailsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [ApplicantDetailsEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective({
            techRecord: new FormGroup({
              adrDetails: new FormGroup({})
            }) as AbstractControl
          })
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantDetailsEditComponent);
    component = fixture.componentInstance;
  });

  it('should create with initialized form controls', () => {
    component.applicantDetails = TESTING_UTILS.mockApplicantDetails();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
