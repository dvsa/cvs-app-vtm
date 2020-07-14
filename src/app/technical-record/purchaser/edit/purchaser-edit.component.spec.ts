import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroupDirective,
  FormGroup,
  AbstractControl
} from '@angular/forms';

import { AddressFormComponent } from '@app/technical-record/shared/address-form/address-form.component';
import { PurchaserEditComponent } from './purchaser-edit.component';
import { TESTING_UTILS } from '@app/utils';
describe('PurchaserEditComponent: ', () => {
  let component: PurchaserEditComponent;
  let fixture: ComponentFixture<PurchaserEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [PurchaserEditComponent, AddressFormComponent],
      providers: [
        FormGroupDirective,
        {
          provide: FormGroupDirective,
          useValue: TESTING_UTILS.mockFormGroupDirective({
            techRecord: new FormGroup({}) as AbstractControl
          })
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaserEditComponent);
    component = fixture.componentInstance;
    component.purchaser = TESTING_UTILS.mockPurchaser();
  });

  it('should render with the given properties ', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });
});
