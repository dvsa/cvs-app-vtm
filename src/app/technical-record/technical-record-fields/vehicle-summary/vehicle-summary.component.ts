import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { TechnicalRecordFieldsComponent } from '../technical-record-fields.component';
import { FormGroup, FormControl } from '@angular/forms';
import { TechRecord } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-vehicle-summary-fields',
  templateUrl: './vehicle-summary.component.html',
  styleUrls: ['./vehicle-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleSummaryFieldsComponent extends TechnicalRecordFieldsComponent implements OnInit  {
  technicalRecord: FormGroup;
  options = { ['HGV']: 'hgv', ['PSV']: 'psv', ['Trailer']: 'trl' };

  ngOnInit() {
    this.technicalRecord = super.setUp();

    const summary: TechRecord = {} as TechRecord;

    this.technicalRecord.addControl('vehicleType', this.fb.control(''));
    this.technicalRecord.addControl('regnDate', this.fb.control(''));
    this.technicalRecord.addControl('manufactureYear', this.fb.control(''));
    this.technicalRecord.addControl('noOfAxles', this.fb.control(''));
    this.technicalRecord.addControl('dtpNumber', this.fb.control(''));


    this.technicalRecord.addControl('speedLimiterMrk', this.fb.control(''));
    this.technicalRecord.addControl('tachoExemptMrk', this.fb.control(''));
    this.technicalRecord.addControl('euroStandard', this.fb.control(''));
    this.technicalRecord.addControl('fuelPropulsionSystem', this.fb.control(''));
    this.technicalRecord.addControl('roadFriendly', this.fb.control(''));
    this.technicalRecord.addControl('drawbarCouplingFitted', this.fb.control(''));


    this.technicalRecord.addControl('vehicleConfiguration', this.fb.control(''));
    this.technicalRecord.addControl('offRoad', this.fb.control(''));
    this.technicalRecord.addControl('numberOfWheelsDriven', this.fb.control(''));
    this.technicalRecord.addControl('euVehicleCategory', this.fb.control(''));
    this.technicalRecord.addControl('emissionsLimit', this.fb.control(''));
    this.technicalRecord.addControl('departmentalVehicleMarker', this.fb.control(''));
    this.technicalRecord.addControl('alterationMarker', this.fb.control(''));

  }

}
