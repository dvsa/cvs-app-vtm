import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormGroupDirective } from '@angular/forms';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { RecordIdentificationEditComponent } from './record-identification-edit.component';

describe('RecordIdentificationEditComponent', () => {
  let component: RecordIdentificationEditComponent;
  let fixture: ComponentFixture<RecordIdentificationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [RecordIdentificationEditComponent],
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
    fixture = TestBed.createComponent(RecordIdentificationEditComponent);
    component = fixture.componentInstance;
  });

  it('should create with initialized form controls', () => {
    component.vin = 'ABCDEFGH654321';
    component.primaryVrm = 'LKJH654';
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });
});
