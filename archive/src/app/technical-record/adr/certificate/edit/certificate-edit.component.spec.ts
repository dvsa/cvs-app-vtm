import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroupDirective,
  AbstractControl,
  FormGroup
} from '@angular/forms';

import { SharedModule } from '@app/shared';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { CertificateEditComponent } from './certificate-edit.component';

describe('CertificateEditComponent', () => {
  let fixture: ComponentFixture<CertificateEditComponent>;
  let component: CertificateEditComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, SharedModule],
      declarations: [CertificateEditComponent],
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
    fixture = TestBed.createComponent(CertificateEditComponent);
    component = fixture.componentInstance;
    component.hasCertificateRequested = true;
    fixture.detectChanges();
  });

  it('should create with initialized form controls', () => {
    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });
});
