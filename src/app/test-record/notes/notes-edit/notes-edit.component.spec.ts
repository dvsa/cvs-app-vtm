import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesEditComponent } from './notes-edit.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VIEW_STATE } from '@app/app.enums';
import { FormGroupDirective } from '@angular/forms';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import {TestType} from '@app/models/test.type';

describe('NotesEditComponent', () => {
  let component: NotesEditComponent;
  let fixture: ComponentFixture<NotesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotesEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    component.testType = {} as TestType;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
