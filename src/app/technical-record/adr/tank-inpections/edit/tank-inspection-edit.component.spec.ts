import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormGroupDirective } from '@angular/forms';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { TankInspectionsEditComponent } from './tank-inspections-edit.component';

describe('TankInspectionsEditComponent', () => {
  let component: TankInspectionsEditComponent;
  let fixture: ComponentFixture<TankInspectionsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [TankInspectionsEditComponent],
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
    fixture = TestBed.createComponent(TankInspectionsEditComponent);
    component = fixture.componentInstance;
    component.tankDetailsData = TESTING_UTILS.mockTankDetails();

    fixture.detectChanges();
  });

  it('should create with initialized form controls', () => {
    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  /**
   * TODO: More unit tests for this file. In anticipation of tc3Detail
   * removal when story is implemented
   */
});
