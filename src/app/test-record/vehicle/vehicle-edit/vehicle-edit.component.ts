import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ControlContainer, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import {
  EU_VEHICLE_CATEGORY_HGV,
  EU_VEHICLE_CATEGORY_PSV,
  EU_VEHICLE_CATEGORY_TRL,
  ODOMETER_READING_UNITS
} from '@app/test-record/test-record.enums';
import { TestResultModel } from '@app/models/test-result.model';
import { Preparer } from '@app/models/preparer';
import { COUNTRY_OF_REGISTRATION } from '@app/app.enums';

@Component({
  selector: 'vtm-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class VehicleEditComponent implements OnInit {
  @Input() testRecord: TestResultModel;
  @Input() preparers: Preparer[];
  @Input() isSubmitted: boolean;
  euVehicleCategories: string[];
  countryOfRegistrationOptions: string[] = Object.values(COUNTRY_OF_REGISTRATION);
  odometerReadingUnits: string[] = Object.values(ODOMETER_READING_UNITS);
  preparersOptions: string[];
  testResultChildForm: FormGroupDirective;

  constructor(parentForm: FormGroupDirective) {
    this.testResultChildForm = parentForm;
  }

  ngOnInit() {
    this.testResultChildForm.form.addControl(
      'vin',
      new FormControl({ value: this.testRecord.vin, disabled: true }, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(21)
      ])
    );
    this.testResultChildForm.form.addControl(
      'vrm',
      new FormControl({ value: this.testRecord.vrm, disabled: true }, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(8)
      ])
    );
    this.testResultChildForm.form.addControl(
      'trailerId',
      new FormControl({ value: this.testRecord.trailerId, disabled: true }, Validators.required)
    );
    this.testResultChildForm.form.addControl(
      'countryOfRegistration',
      new FormControl(this.testRecord.countryOfRegistration, Validators.required)
    );
    this.testResultChildForm.form.addControl(
      'euVehicleCategory',
      new FormControl(this.testRecord.euVehicleCategory, Validators.required)
    );
    this.testResultChildForm.form.addControl(
      'odometerReading',
      new FormControl(this.testRecord.odometerReading, Validators.required)
    );
    this.testResultChildForm.form.addControl(
      'odometerReadingUnits',
      new FormControl(this.testRecord.odometerReadingUnits, Validators.required)
    );
    this.testResultChildForm.form.addControl(
      'preparer',
      new FormControl(
        !!this.testRecord.preparerName && !!this.testRecord.preparerId
          ? this.testRecord.preparerName + '(' + this.testRecord.preparerId + ')'
          : ''
      )
    );

    this.preparersOptions = !!this.preparers
      ? this.preparers.map((res) => res.preparerName + '(' + res.preparerId + ')')
      : [''];

    if (!!this.testRecord) {
      switch (this.testRecord.vehicleType) {
        case 'psv':
          this.euVehicleCategories = Object.values(EU_VEHICLE_CATEGORY_PSV);
          break;
        case 'hgv':
          this.euVehicleCategories = Object.values(EU_VEHICLE_CATEGORY_HGV);
          break;
        case 'trl':
          this.euVehicleCategories = Object.values(EU_VEHICLE_CATEGORY_TRL);
          break;
        default:
          this.euVehicleCategories = [''];
      }
    }
  }

}
