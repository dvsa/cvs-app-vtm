import {DebugElement} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  FormGroupDirective,
  FormGroup
} from '@angular/forms';

import {NotesEditComponent} from './notes-edit.component';
import { TESTING_UTILS } from '@app/utils';


describe('DocumentsEditComponent component', () => {
  let component: NotesEditComponent;
  let fixture: ComponentFixture<NotesEditComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [NotesEditComponent],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective({
            techRecord: new FormGroup({
            }) as AbstractControl
          })
        }
      ]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesEditComponent);
    component = fixture.componentInstance;
    component.notesDetails = '';
    de = fixture.debugElement;

    fixture.detectChanges();
  });


  it('should render with the given properties ', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

});
