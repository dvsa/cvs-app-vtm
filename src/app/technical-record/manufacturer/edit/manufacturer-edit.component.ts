import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { FormGroup, ControlContainer, FormGroupDirective, FormBuilder } from '@angular/forms';

import { AddressFormComponent } from '@app/technical-record/shared/address-form/address-form.component';

import { ManufacturerDetails } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-manufacturer-edit',
  templateUrl: './manufacturer-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class ManufacturerEditComponent implements OnInit {
  @Input() manufacturerEditDetails: ManufacturerDetails;
  @ViewChild(AddressFormComponent) commonAddressForm: AddressFormComponent;

  techRecordFg: FormGroup;

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  get manufacturerDetails() {
    return this.techRecordFg.get('manufacturerDetails') as FormGroup;
  }

  ngOnInit() {
    this.techRecordFg = this.parent.form.get('techRecord') as FormGroup;

    const manufDetails: ManufacturerDetails = !!this.manufacturerEditDetails
      ? this.manufacturerEditDetails
      : ({} as ManufacturerDetails);

    const { name, ...addressInfo } = manufDetails;
    const commonAddressFields = this.commonAddressForm.createControls(addressInfo);

    this.techRecordFg.addControl(
      'manufacturerDetails',
      this.fb.group({
        name: this.fb.control(manufDetails.name),
        faxNumber: this.fb.control(manufDetails.faxNumber),
        manufacturerNotes: this.fb.control(manufDetails.manufacturerNotes),
        ...commonAddressFields
      })
    );
  }
}
