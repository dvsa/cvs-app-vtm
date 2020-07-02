import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesEditComponent } from './notes-edit.component';
import { VIEW_STATE } from '@app/app.enums';
import {
  FormGroupDirective,
  FormGroup,
  AbstractControl,
  ReactiveFormsModule
} from '@angular/forms';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { TEST_MODEL_UTILS } from '@app/utils/test-model.utils';
import { SharedModule } from '@app/shared';

describe('NotesEditComponent', () => {
  let component: NotesEditComponent;
  let fixture: ComponentFixture<NotesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, ReactiveFormsModule],
      declarations: [NotesEditComponent],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective({
            testType: new FormGroup({}) as AbstractControl
          })
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesEditComponent);
    component = fixture.componentInstance;
    component.currentState = VIEW_STATE.VIEW_ONLY;
    component.testType = TEST_MODEL_UTILS.mockTestType();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
