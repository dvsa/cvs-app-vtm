import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { AdrComponent } from '@app/technical-record/adr/adr.component';
import { DisplayOptionsPipe } from '@app/pipes/display-options.pipe';
import { SelectOption } from '@app/models/select-option';
import { TankDetails, Tc2Details, Tc3Details } from '@app/models/Tank';
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

  ngOnInit() {
    this.adrForm = super.setUp();

    const details: TankDetails = !!this.tankDetailsData
      ? this.tankDetailsData
      : ({} as TankDetails);
    const tc2Details: Tc2Details = !!details.tc2Details ? details.tc2Details : ({} as Tc2Details);
    const tc3Details: Tc3Details[] = !!details.tc3Details
      ? details.tc3Details
      : ([] as Tc3Details[]);

    this.inspectionTypeOptions = new DisplayOptionsPipe().transform(
      Object.keys(INSPECTION_TYPES)
    );

    let group: FormGroup = this.adrForm.get('tank.tankDetails') as FormGroup;
    if (group !== null) {
      this.addToGroup({ group, tc2Details, tc3Details });
    } else {
      this.adrForm.addControl('tank', this.fb.group({ tankDetails: this.fb.group({}) }));
      group = this.adrForm.get('tank.tankDetails') as FormGroup;
      this.addToGroup({ group, tc2Details, tc3Details });
    }
  }

  addToGroup(params) {
    const { group, tc2Details, tc3Details } = params;

    group.addControl(
      'tc2Details',
      this.fb.group({
        tc2IntermediateApprovalNo: this.fb.control(tc2Details.tc2IntermediateApprovalNo),
        tc2IntermediateExpiryDate: this.fb.control(tc2Details.tc2IntermediateExpiryDate),
        tc2Type: this.fb.control('initial')
      })
    );

    group.addControl('tc3Details', this.buildSequentArrayGroup(tc3Details));
  }

  buildSequentArrayGroup(subsequentData: Tc3Details[]): FormArray {
    return this.fb.array(subsequentData.map(this.buildSubsequentGroup.bind(this)));
  }

  getTc3Type(tc3Type: string): string {
    const defaultType = this.inspectionTypeOptions.find(
      (type) => type.name.toLowerCase() === tc3Type
    );

    return !!defaultType ? defaultType.name.toLowerCase() : '';
  }

  buildSubsequentGroup(tc3Data = {} as Tc3Details): FormGroup {
    return this.fb.group({
      tc3Type: this.getTc3Type(tc3Data.tc3Type),
      tc3PeriodicNumber: tc3Data.tc3PeriodicNumber,
      tc3PeriodicExpiryDate: tc3Data.tc3PeriodicExpiryDate
    });
  }

  addSubsequentInspectionGroup(): void {
    this.tc3Details.push(this.buildSubsequentGroup());
    this.tc3Details.markAsDirty();
  }
}
