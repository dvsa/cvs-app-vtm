import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { AdrComponent } from '@app/technical-record/adr/adr.component';
import { DisplayOptionsPipe } from '@app/pipes/display-options.pipe';
import { SelectOption } from '@app/models/select-option';
import { TankDetails, Tc3Detail } from '@app/models/Tank';
import { INSPECTION_TYPES } from '@app/app.enums';

@Component({
  selector: 'vtm-tank-inspections-edit',
  templateUrl: './tank-inspections-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TankInspectionsEditComponent extends AdrComponent implements OnInit {
  submitted: boolean;
  inspectionTypeOptions: SelectOption[];
  adrForm: FormGroup;

  @Input() tankDetailsData: TankDetails;

  get tankDetails() {
    return this.adrForm.get('tank.tankDetails') as FormGroup;
  }

  get tc2Details() {
    return this.tankDetails.get('tc2Details') as FormGroup;
  }

  get tc3Details() {
    return this.tankDetails.get('tc3Details') as FormArray;
  }

  super() {}

  ngOnInit() {
    this.adrForm = super.setUp();

    this.inspectionTypeOptions = new DisplayOptionsPipe().transform(
      Object.keys(INSPECTION_TYPES)
    );

    const group: FormGroup = this.adrForm.get('tank.tankDetails') as FormGroup;
    if (group !== null) {
      group.addControl(
        'tc2Details',
        this.fb.group({
          tc2IntermediateApprovalNo: this.fb.control(
            this.tankDetailsData.tc2Details.tc2IntermediateApprovalNo
          ),
          tc2IntermediateExpiryDate: this.fb.control(
            this.tankDetailsData.tc2Details.tc2IntermediateExpiryDate
          ),
          tc2Type: this.fb.control('initial')
        })
      );

      group.addControl(
        'tc3Details',
        this.tankDetailsData.tc3Details
          ? this.buildSequentArrayGroup(this.tankDetailsData.tc3Details)
          : this.fb.array([])
      );
    }
  }

  buildSequentArrayGroup(subsequentData: Tc3Detail[]): FormArray {
    return this.fb.array(subsequentData.map(this.buildSubsequentGroup.bind(this)));
  }

  getTc3Type(tc3Type: string): string {
    const defaultType = this.inspectionTypeOptions.find(
      (type) => type.name.toLowerCase() === tc3Type
    );

    return !!defaultType ? defaultType.name.toLowerCase() : '';
  }

  buildSubsequentGroup(tc3Data = {} as Tc3Detail): FormGroup {
    return this.fb.group({
      tc3Type: this.getTc3Type(tc3Data.tc3Type),
      tc3PeriodicNumber: tc3Data.tc3PeriodicNumber,
      tc3PeriodicExpiryDate: tc3Data.tc3PeriodicExpiryDate
    });
  }

  addSubsequentInspectionGroup() {
    this.tc3Details.push(this.buildSubsequentGroup());
    this.tc3Details.markAsDirty();
  }
}
