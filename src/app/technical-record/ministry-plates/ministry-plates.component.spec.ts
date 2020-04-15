import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryPlatesComponent } from './ministry-plates.component';
import { UserService } from '@app/app-user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Applicant } from '@app/models/tech-record.model';
import { UserDetails } from '@app/models/user-details';
import { PLATE_ISSUE_OPTIONS } from '@app/technical-record/technical-record.constants';

describe('MinistryPlatesComponent', () => {
  let component: MinistryPlatesComponent;
  let fixture: ComponentFixture<MinistryPlatesComponent>;
  let getUser: jest.Mock;
  const userDetails = {
    msOid: 'test-oid',
    msUser: 'test'
  } as UserDetails;

  beforeEach(async(() => {
    getUser = jest.fn();
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [MinistryPlatesComponent],
      providers: [
        {
          provide: UserService,
          useValue: { getUser }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinistryPlatesComponent);
    component = fixture.componentInstance;
    component.applicantDetails = { emailAddress: 'test@test.te' } as Applicant;
    component.plateIssueOptions = PLATE_ISSUE_OPTIONS;
    getUser.mockReturnValue(userDetails);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('should create form of Plates structure', () => {
    const expectedPlate = {
      plateIssueDate: new Date(Date.now()).toISOString().split('T')[0],
      plateIssuer: 'test',
      plateReasonForIssue: 'Original',
      toEmailAddress: 'test@test.te'
    };

    expect(component.platesForm.getRawValue()).toEqual(expectedPlate);
  });
});
