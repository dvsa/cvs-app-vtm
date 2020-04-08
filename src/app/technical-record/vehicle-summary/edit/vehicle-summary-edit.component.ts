import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import {
  FormGroup,
  ControlContainer,
  FormGroupDirective,
  FormBuilder,
  FormArray
} from '@angular/forms';

import { TechRecord, Axle } from '@app/models/tech-record.model';
import { VEHICLE_TYPES } from '@app/app.enums';
import {
  AXLENUMOPTIONS,
  BOOLEANRADIOOPTIONS,
  FUELPROPULSION,
  VEHICLE_CLASS,
  VEHICLE_CONFIGURATION,
  VEHICLE_EUCATEGORY
} from '@app/technical-record/technical-record.constants';
import { SelectOption } from '@app/models/select-option';
import { DisplayOptionsPipe } from '@app/pipes/display-options.pipe';

@Component({
  selector: 'vtm-vehicle-summary-edit',
  templateUrl: './vehicle-summary-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class VehicleSummaryEditComponent implements OnInit {
  @Input() activeRecord: TechRecord;

  techRecordFg: FormGroup;
  vehicleTypeOptions = {
    ['HGV']: VEHICLE_TYPES.HGV,
    ['PSV']: VEHICLE_TYPES.PSV,
    ['Trailer']: VEHICLE_TYPES.TRL
  };
  axleNoOptions: number[];
  booleanOptions = BOOLEANRADIOOPTIONS;
  fuelPropulsionOptions: SelectOption[];
  vehicleClassOptions: SelectOption[];
  vehicleConfigOptions: SelectOption[];
  vehicleEUCategoryOptions: SelectOption[];

  get axles() {
    return this.techRecordFg.get('axles') as FormArray;
  }

  constructor(private parent: FormGroupDirective, private fb: FormBuilder) {}

  ngOnInit() {
    this.axleNoOptions = AXLENUMOPTIONS;
    this.fuelPropulsionOptions = new DisplayOptionsPipe().transform(FUELPROPULSION);
    this.vehicleClassOptions = new DisplayOptionsPipe().transform(VEHICLE_CLASS);
    this.vehicleConfigOptions = new DisplayOptionsPipe().transform(VEHICLE_CONFIGURATION);
    this.vehicleEUCategoryOptions = new DisplayOptionsPipe().transform(VEHICLE_EUCATEGORY);

    const { brakes, axles, vehicleClass } = this.activeRecord;
    const dtpNumber = brakes ? brakes.dtpNumber : null;
    const techAxles = axles && axles.length ? axles : [];
    const vehicleClassDesc =
      vehicleClass && vehicleClass.description ? vehicleClass.description : null;

    this.techRecordFg = this.parent.form.get('techRecord') as FormGroup;
    this.techRecordFg.addControl('vehicleType', this.fb.control(this.activeRecord.vehicleType));
    this.techRecordFg.addControl('regnDate', this.fb.control(this.activeRecord.regnDate));
    this.techRecordFg.addControl(
      'manufactureYear',
      this.fb.control(this.activeRecord.manufactureYear)
    );
    this.techRecordFg.addControl('noOfAxles', this.fb.control(this.activeRecord.noOfAxles));
    this.techRecordFg.addControl(
      'brakes',
      this.fb.group({
        dtpNumber: this.fb.control(dtpNumber)
      })
    );
    this.techRecordFg.addControl('axles', this.buildAxleArrayGroup(techAxles));
    this.techRecordFg.addControl(
      'speedLimiterMrk',
      this.fb.control(
        this.setDisplayOptionByDefault(this.activeRecord.speedLimiterMrk, BOOLEANRADIOOPTIONS.No)
      )
    );
    this.techRecordFg.addControl(
      'tachoExemptMrk',
      this.fb.control(
        this.setDisplayOptionByDefault(this.activeRecord.tachoExemptMrk, BOOLEANRADIOOPTIONS.No)
      )
    );
    this.techRecordFg.addControl('euroStandard', this.fb.control(this.activeRecord.euroStandard));
    this.techRecordFg.addControl(
      'roadFriendly',
      this.fb.control(
        this.setDisplayOptionByDefault(this.activeRecord.roadFriendly, BOOLEANRADIOOPTIONS.No)
      )
    );
    this.techRecordFg.addControl(
      'fuelPropulsionSystem',
      this.fb.control(this.activeRecord.fuelPropulsionSystem)
    );
    this.techRecordFg.addControl(
      'drawbarCouplingFitted',
      this.fb.control(
        this.setDisplayOptionByDefault(
          this.activeRecord.drawbarCouplingFitted,
          BOOLEANRADIOOPTIONS.No
        )
      )
    );
    this.techRecordFg.addControl(
      'vehicleClass',
      this.fb.group({
        description: this.fb.control(vehicleClassDesc)
      })
    );
    this.techRecordFg.addControl(
      'vehicleConfiguration',
      this.fb.control(this.activeRecord.vehicleConfiguration)
    );
    this.techRecordFg.addControl(
      'offRoad',
      this.fb.control(
        this.setDisplayOptionByDefault(this.activeRecord.offRoad, BOOLEANRADIOOPTIONS.No)
      )
    );
    this.techRecordFg.addControl(
      'numberOfWheelsDriven',
      this.fb.control(this.activeRecord.numberOfWheelsDriven)
    );
    this.techRecordFg.addControl(
      'euVehicleCategory',
      this.fb.control(this.activeRecord.euVehicleCategory)
    );
    this.techRecordFg.addControl(
      'emissionsLimit',
      this.fb.control(this.activeRecord.emissionsLimit)
    );
    this.techRecordFg.addControl(
      'departmentalVehicleMarker',
      this.fb.control(
        this.setDisplayOptionByDefault(
          this.activeRecord.departmentalVehicleMarker,
          BOOLEANRADIOOPTIONS.No
        )
      )
    );

    // const techAxles = [
    //   {
    //     axleNumber: 0,
    //     parkingBrakeMrk: false
    //   },
    //   {
    //     axleNumber: 1,
    //     parkingBrakeMrk: true
    //   },
    //   {
    //     axleNumber: 2,
    //     parkingBrakeMrk: true
    //   }
    // ] as Axle[];
  }

  buildAxleArrayGroup(axles: Axle[]): FormArray {
    return this.fb.array(axles.map(this.buildAxleGroup.bind(this)));
  }

  buildAxleGroup(axle: Axle, index: number): FormGroup {
    return this.fb.group({
      name: `Axle ${index + 1}`,
      selected: axle.parkingBrakeMrk
    });
  }

  setDisplayOptionByDefault(currentValue: boolean, defaultValue: boolean): boolean {
    if (currentValue === undefined) {
      return defaultValue;
    }

    return currentValue;
  }

  unsorted(): number {
    return 0;
  }
}
