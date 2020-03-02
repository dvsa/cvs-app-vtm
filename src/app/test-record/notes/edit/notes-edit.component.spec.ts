import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesEditComponent } from './notes-edit.component';
import { VIEW_STATE } from '@app/app.enums';
import { FormGroupDirective } from '@angular/forms';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { TESTING_TEST_MODELS_UTILS } from '@app/utils/testing-test-models.utils';

describe('NotesEditComponent', () => {
  let component: NotesEditComponent;
  let fixture: ComponentFixture<NotesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotesEditComponent],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective()
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesEditComponent);
    component = fixture.componentInstance;
    component.currentState = VIEW_STATE.VIEW_ONLY;
    component.testType = TESTING_TEST_MODELS_UTILS.mockTestType();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
