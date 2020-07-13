import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormGroup,
  ControlContainer,
  FormGroupDirective,
  FormBuilder,
  FormArray
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, tap, takeUntil } from 'rxjs/operators';

import { TechRecord, Axle } from '@app/models/tech-record.model';
import { VEHICLE_TYPES, VIEW_STATE } from '@app/app.enums';
import {
  AXLE_NUM_OPTIONS,
  BOOLEAN_RADIO_OPTIONS,
  FUEL_PROPULSION,
  VEHICLE_CLASS,
  VEHICLE_CONFIGURATION,
  VEHICLE_EUCATEGORY
} from '@app/technical-record/technical-record.constants';
import { DisplayOptionsPipe } from '@app/pipes/display-options.pipe';
import { TechRecordHelperService } from '@app/technical-record/tech-record-helper.service';

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
export class VehicleSummaryEditComponent implements OnInit, OnDestroy {
  @Input() techRecord: TechRecord;
  @Input() viewState: VIEW_STATE;

  techRecordFg: FormGroup;
  numberOfAxles$: Observable<number>;
  onDestroy$ = new Subject();
  displayInEditView: boolean;

  vehicleTypeOptions = {
    ['HGV']: VEHICLE_TYPES.HGV,
    ['PSV']: VEHICLE_TYPES.PSV,
    ['Trailer']: VEHICLE_TYPES.TRL
  };
  booleanOptions = BOOLEAN_RADIO_OPTIONS;
  axleNoOptions = AXLE_NUM_OPTIONS;
  fuelPropulsionOptions = new DisplayOptionsPipe().transform(FUEL_PROPULSION);
  vehicleClassOptions = new DisplayOptionsPipe().transform(VEHICLE_CLASS);
  vehicleConfigOptions = new DisplayOptionsPipe().transform(VEHICLE_CONFIGURATION);
  vehicleEUCategoryOptions = new DisplayOptionsPipe().transform(VEHICLE_EUCATEGORY);

  get axles() {
    return this.techRecordFg.get('axles') as FormArray;
  }

  constructor(
    private parent: FormGroupDirective,
    private fb: FormBuilder,
    private techRecHelper: TechRecordHelperService,
    private detectChange: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.numberOfAxles$ = this.techRecHelper.getNumberOfAxles();
    this.displayInEditView = this.viewState === VIEW_STATE.EDIT;

    const { brakes, axles, vehicleClass } = this.techRecord;
    const dtpNumber = brakes ? brakes.dtpNumber : null;
    const techAxles = axles && axles.length ? axles : [];
    const vehicleClassDesc =
      vehicleClass && vehicleClass.description ? vehicleClass.description : null;

    this.techRecordFg = this.parent.form.get('techRecord') as FormGroup;
    this.techRecordFg.addControl('vehicleType', this.fb.control(this.techRecord.vehicleType));
    this.techRecordFg.addControl('regnDate', this.fb.control(this.techRecord.regnDate));
    this.techRecordFg.addControl(
      'manufactureYear',
      this.fb.control(this.techRecord.manufactureYear)
    );
    this.techRecordFg.addControl('noOfAxles', this.fb.control(this.techRecord.noOfAxles));
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
        this.setDisplayOptionByDefault(this.techRecord.speedLimiterMrk, BOOLEAN_RADIO_OPTIONS.No)
      )
    );
    this.techRecordFg.addControl(
      'tachoExemptMrk',
      this.fb.control(
        this.setDisplayOptionByDefault(this.techRecord.tachoExemptMrk, BOOLEAN_RADIO_OPTIONS.No)
      )
    );
    this.techRecordFg.addControl('euroStandard', this.fb.control(this.techRecord.euroStandard));
    this.techRecordFg.addControl(
      'roadFriendly',
      this.fb.control(
        this.setDisplayOptionByDefault(this.techRecord.roadFriendly, BOOLEAN_RADIO_OPTIONS.No)
      )
    );
    this.techRecordFg.addControl(
      'fuelPropulsionSystem',
      this.fb.control(this.techRecord.fuelPropulsionSystem)
    );
    this.techRecordFg.addControl(
      'drawbarCouplingFitted',
      this.fb.control(
        this.setDisplayOptionByDefault(
          this.techRecord.drawbarCouplingFitted,
          BOOLEAN_RADIO_OPTIONS.No
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
      this.fb.control(this.techRecord.vehicleConfiguration)
    );
    this.techRecordFg.addControl(
      'offRoad',
      this.fb.control(
        this.setDisplayOptionByDefault(this.techRecord.offRoad, BOOLEAN_RADIO_OPTIONS.No)
      )
    );
    this.techRecordFg.addControl(
      'numberOfWheelsDriven',
      this.fb.control(this.techRecord.numberOfWheelsDriven)
    );
    this.techRecordFg.addControl(
      'euVehicleCategory',
      this.fb.control(this.techRecord.euVehicleCategory)
    );
    this.techRecordFg.addControl(
      'emissionsLimit',
      this.fb.control(this.techRecord.emissionsLimit)
    );
    this.techRecordFg.addControl(
      'departmentalVehicleMarker',
      this.fb.control(
        this.setDisplayOptionByDefault(
          this.techRecord.departmentalVehicleMarker,
          BOOLEAN_RADIO_OPTIONS.No
        )
      )
    );
    this.techRecordFg.addControl(
      'alterationMarker',
      this.fb.control(
        this.techRecord.alterationMarker
          ? this.techRecord.alterationMarker
          : BOOLEAN_RADIO_OPTIONS.No
      )
    );

    this.handleFormChanges();
  }

  buildAxleArrayGroup(axles: Axle[]): FormArray {
    return this.fb.array(axles.map(this.buildAxleGroup.bind(this)));
  }

  buildAxleGroup(axle: Axle): FormGroup {
    return this.fb.group({
      name: `Axle ${axle.axleNumber}`,
      selected: axle.parkingBrakeMrk,
      axleNumber: axle.axleNumber
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

  handleFormChanges() {
    this.techRecordFg
      .get('noOfAxles')
      .valueChanges.pipe(
        debounceTime(500),
        tap((value) => this.techRecHelper.setNumberOfAxles(value)),
        takeUntil(this.onDestroy$)
      )
      .subscribe();

    this.numberOfAxles$
      .pipe(
        tap((numAxles) => {
          this.createAxleGroupByNumberOfAxles(numAxles);
          this.detectChange.markForCheck();
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe();
  }

  private createAxleGroupByNumberOfAxles(numOfAxles: number): void {
    const numOfIterations: number = this.axles.controls.length - numOfAxles;

    numOfIterations < 0
      ? this.addAxleGroupByIterations(numOfIterations)
      : this.removeAxleGroupByIterations(numOfIterations);

    this.axles.markAsDirty();
  }

  private addAxleGroupByIterations(numofIterations: number): void {
    let index = numofIterations;
    for (; index < 0; index++) {
      const axleGroup = this.buildAxleGroup({
        axleNumber: this.axles.controls.length + 1,
        parkingBrakeMrk: false
      } as Axle);

      this.axles.push(axleGroup);
    }
  }

  private removeAxleGroupByIterations(numofIterations: number): void {
    let index = numofIterations;
    for (; index > 0; index--) {
      this.axles.removeAt(--this.axles.controls.length);
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
