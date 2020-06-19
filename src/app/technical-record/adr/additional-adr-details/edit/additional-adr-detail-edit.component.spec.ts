import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroupDirective,
  FormGroup,
  AbstractControl
} from '@angular/forms';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { AdditionalAdrDetailEditComponent } from './additional-adr-detail-edit.component';

describe('AdditionalAdrDetailEditComponent', () => {
  let fixture: ComponentFixture<AdditionalAdrDetailEditComponent>;
  let component: AdditionalAdrDetailEditComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [AdditionalAdrDetailEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective({
            techRecord: new FormGroup({
              adrDetails: new FormGroup({})
            }) as AbstractControl
          })
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalAdrDetailEditComponent);
    component = fixture.componentInstance;
    component.adrDetails = TESTING_UTILS.mockAdrDetails();
    fixture.detectChanges();
  });

  it('should create with initialized form controls', () => {
    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });
});
