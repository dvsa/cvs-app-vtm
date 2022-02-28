import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  FormGroupDirective,
  FormGroup
} from '@angular/forms';

import { ApplicantEditComponent } from './applicant-edit.component';
import { TESTING_UTILS } from '@app/utils';

describe('ApplicantEditComponent component', () => {
  let component: ApplicantEditComponent;
  let fixture: ComponentFixture<ApplicantEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ApplicantEditComponent],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective({
            techRecord: new FormGroup({}) as AbstractControl
          })
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantEditComponent);
    component = fixture.componentInstance;
    component.applicant = TESTING_UTILS.mockApplicant();
  });

  it('should render with the given properties ', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
