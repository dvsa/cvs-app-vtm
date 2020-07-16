import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroupDirective,
  FormGroup,
  AbstractControl
} from '@angular/forms';

import { AuthIntoServiceEditComponent } from './auth-into-service-edit.component';
import { TechRecord, AuthIntoService } from '@app/models/tech-record.model';
import { TESTING_UTILS } from '@app/utils';
import { SharedModule } from '@app/shared';

const mockTechRecord = {
  authIntoService: TESTING_UTILS.mockAuthoIntoService()
} as TechRecord;

describe('AuthIntoServiceEditComponent:', () => {
  let component: AuthIntoServiceEditComponent;
  let fixture: ComponentFixture<AuthIntoServiceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [AuthIntoServiceEditComponent],
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
    fixture = TestBed.createComponent(AuthIntoServiceEditComponent);
    component = fixture.componentInstance;
  });

  it('should create with empty control states', () => {
    component.authIntoServiceEditDetails = {} as AuthIntoService;
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(component.techRecordFg.get('authIntoService').value).toEqual({
      cocIssueDate: null,
      dateAuthorised: null,
      datePending: null,
      dateReceived: null,
      dateRejected: null
    });

    expect(fixture).toMatchSnapshot();
  });

  it('should create with initialized form controls', () => {
    component.authIntoServiceEditDetails = mockTechRecord.authIntoService;
    fixture.detectChanges();

    expect(component.techRecordFg.get('authIntoService').value).toEqual(
      mockTechRecord.authIntoService
    );
  });
});
