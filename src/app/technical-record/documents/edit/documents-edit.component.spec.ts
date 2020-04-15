import {DebugElement} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  FormGroupDirective,
  FormGroup
} from '@angular/forms';

import {DocumentsEditComponent} from './documents-edit.component';
import { TESTING_UTILS } from '@app/utils';


describe('DocumentsEditComponent component', () => {
  let component: DocumentsEditComponent;
  let fixture: ComponentFixture<DocumentsEditComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [DocumentsEditComponent],
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
    fixture = TestBed.createComponent(DocumentsEditComponent);
    component = fixture.componentInstance;
    component.microfilmDetails = TESTING_UTILS.mockMicrofilm();
    de = fixture.debugElement;

    fixture.detectChanges();
  });


  it('should render with the given properties', () => {
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

});
