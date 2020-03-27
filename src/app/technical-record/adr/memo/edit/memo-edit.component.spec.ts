import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormGroupDirective } from '@angular/forms';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { MemoEditComponent } from './memo-edit.component';

describe('MemoEditComponent', () => {
  let fixture: ComponentFixture<MemoEditComponent>;
  let component: MemoEditComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [MemoEditComponent],
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
    fixture = TestBed.createComponent(MemoEditComponent);
    component = fixture.componentInstance;
    component.hasMemosApplied = true;
    fixture.detectChanges();
  });

  it('should create with initialized form controls', () => {
    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });
});
