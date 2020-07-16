import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressFormComponent } from './address-form.component';
import { TESTING_UTILS } from '@app/utils/testing.utils';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddressInformation } from '@app/models/tech-record.model';

describe('AddressFormComponent: ', () => {
  let component: AddressFormComponent;
  let fixture: ComponentFixture<AddressFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [AddressFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressFormComponent);
    component = fixture.componentInstance;
  });

  it('should create controls with default entity', () => {
    component.createControls({} as AddressInformation);
    fixture.detectChanges();

    expect(component).toBeDefined();
    expect(fixture).toMatchSnapshot();
  });

  it('should create controls with populated entity', () => {
    const mockAddressInfo = TESTING_UTILS.mockAddressInformation();

    component.createControls(mockAddressInfo);
    expect(component.addressFg.get('address1').value).toEqual(mockAddressInfo.address1);
    expect(component.addressFg.get('address2').value).toEqual(mockAddressInfo.address2);
    expect(component.addressFg.get('address3').value).toEqual(mockAddressInfo.address3);
    expect(component.addressFg.get('postTown').value).toEqual(mockAddressInfo.postTown);
    expect(component.addressFg.get('postCode').value).toEqual(mockAddressInfo.postCode);
    expect(component.addressFg.get('emailAddress').value).toEqual(mockAddressInfo.emailAddress);
    expect(component.addressFg.get('telephoneNumber').value).toEqual(
      mockAddressInfo.telephoneNumber
    );
  });
});
