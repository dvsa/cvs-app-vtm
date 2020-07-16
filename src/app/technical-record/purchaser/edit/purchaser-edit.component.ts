import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { FormGroup, ControlContainer, FormGroupDirective, FormBuilder } from '@angular/forms';

import { AddressFormComponent } from '@app/technical-record/shared/address-form/address-form.component';

import { PurchaserDetails } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-purchaser-edit',
  templateUrl: './purchaser-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class PurchaserEditComponent implements OnInit {
  @Input() purchaser: PurchaserDetails;
  @ViewChild(AddressFormComponent) commonAddressForm: AddressFormComponent;

  techRecordFg: FormGroup;

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  get purchaserDetails() {
    return this.techRecordFg.get('purchaserDetails') as FormGroup;
  }

  ngOnInit() {
    this.techRecordFg = this.parent.form.get('techRecord') as FormGroup;

    const pcrDetails: PurchaserDetails = !!this.purchaser
      ? this.purchaser
      : ({} as PurchaserDetails);

    const { name, ...addressInfo } = pcrDetails;

    const commonAddressFields = this.commonAddressForm.createControls(addressInfo);

    this.techRecordFg.addControl(
      'purchaserDetails',
      this.fb.group({
        name: this.fb.control(pcrDetails.name),
        faxNumber: this.fb.control(pcrDetails.faxNumber),
        purchaserNotes: this.fb.control(pcrDetails.purchaserNotes),
        ...commonAddressFields
      })
    );
  }
}
