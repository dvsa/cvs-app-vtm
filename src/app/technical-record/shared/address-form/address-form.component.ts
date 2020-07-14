import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AddressInformation } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-address-form',
  templateUrl: './address-form.component.html'
})
export class AddressFormComponent {
  addressFg: FormGroup;

  constructor(private fb: FormBuilder) {}

  createControls(entity: AddressInformation) {
    this.addressFg = this.fb.group({
      address1: this.fb.control(entity.address1),
      address2: this.fb.control(entity.address2),
      postTown: this.fb.control(entity.postTown),
      address3: this.fb.control(entity.address3),
      postCode: this.fb.control(entity.postCode),
      telephoneNumber: this.fb.control(entity.telephoneNumber),
      emailAddress: this.fb.control(entity.emailAddress)
    });

    return this.addressFg.controls;
  }
}
