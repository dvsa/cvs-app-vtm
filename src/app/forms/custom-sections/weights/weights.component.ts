/* eslint-disable no-underscore-dangle */
import {
  Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
} from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import {
  CustomFormArray, CustomFormGroup, FormNode, FormNodeEditTypes,
} from '@forms/services/dynamic-form.types';
import { HgvWeight } from '@forms/templates/hgv/hgv-weight.template';
import { PsvWeightsTemplate } from '@forms/templates/psv/psv-weight.template';
import { TrlWeight } from '@forms/templates/trl/trl-weight.template';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { addAxle, removeAxle, updateBrakeForces } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-weights[vehicleTechRecord]',
  templateUrl: './weights.component.html',
  styleUrls: ['./weights.component.scss'],
})
export class WeightsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() vehicleTechRecord!: TechRecordType<'psv'> | TechRecordType<'trl'> | TechRecordType<'hgv'>;
  @Input() isEditing = false;
  @Output() formChange = new EventEmitter();

  public form!: CustomFormGroup;
  private _formSubscription = new Subscription();
  public isError = false;
  public errorMessage?: string;

  constructor(public dynamicFormsService: DynamicFormService, private store: Store<TechnicalRecordServiceState>) {}

  ngOnInit(): void {
    this.initializeForm();
    this.subscribeToFieldsForGrossLadenWeightRecalculation();
    this.subscribeToFormChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.handleVehicleTechRecordChange(changes);
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  get template(): FormNode {
    switch (this.vehicleTechRecord.techRecord_vehicleType) {
      case VehicleTypes.PSV:
        return PsvWeightsTemplate;
      case VehicleTypes.HGV:
        return HgvWeight;
      case VehicleTypes.TRL:
        return TrlWeight;
      default:
        throw Error('Incorrect vehicle type!');
    }
  }

  get isPsv(): boolean {
    return this.vehicleTechRecord.techRecord_vehicleType === VehicleTypes.PSV;
  }
  get isHgv(): boolean {
    return this.vehicleTechRecord.techRecord_vehicleType === VehicleTypes.HGV;
  }
  get isTrl(): boolean {
    return this.vehicleTechRecord.techRecord_vehicleType === VehicleTypes.TRL;
  }
  get requiredPlates(): boolean {
    return !this.isPsv && this.isEditing;
  }
  get types(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }
  get axles(): CustomFormArray {
    return this.form.get(['techRecord_axles']) as CustomFormArray;
  }

  private initializeForm(): void {
    this.form = this.dynamicFormsService.createForm(this.template, this.vehicleTechRecord) as CustomFormGroup;
  }

  private subscribeToFieldsForGrossLadenWeightRecalculation(): void {
    const fields = [
      'techRecord_seatsUpperDeck',
      'techRecord_seatsLowerDeck',
      'techRecord_manufactureYear',
      'techRecord_grossKerbWeight',
      'techRecord_standingCapacity',
    ];

    fields.forEach((field) => {
      this.form.get(field)?.valueChanges.subscribe(() => {
        if (this.form.value.techRecord_manufactureYear) {
          const newGrossLadenWeight = this.calculateGrossLadenWeight();
          this.form.patchValue({ techRecord_grossLadenWeight: newGrossLadenWeight }, { emitEvent: false });
        }
      });
    });
  }

  private handleVehicleTechRecordChange(changes: SimpleChanges): void {
    const { vehicleTechRecord } = changes;
    if (this.form && vehicleTechRecord) {
      const { currentValue, previousValue } = vehicleTechRecord;

      const fieldsChanged = [
        'techRecord_seatsUpperDeck',
        'techRecord_seatsLowerDeck',
        'techRecord_manufactureYear',
        'techRecord_grossKerbWeight',
        'techRecord_standingCapacity',
      ].some((field) => currentValue[`${field}`] !== previousValue[`${field}`]);

      if (fieldsChanged && currentValue.techRecord_manufactureYear && this.vehicleTechRecord.techRecord_vehicleType === 'psv') {
        this.vehicleTechRecord.techRecord_grossLadenWeight = this.calculateGrossLadenWeight();
      }

      this.form.patchValue(this.vehicleTechRecord, { emitEvent: false });
    }
  }

  private subscribeToFormChanges(): void {
    this._formSubscription.add(
      this.form.valueChanges.subscribe((event) => {
        if (event?.techRecord_grossLadenWeight) {
          (this.vehicleTechRecord as TechRecordType<'psv'>).techRecord_grossLadenWeight = event.techRecord_grossLadenWeight;
          this.form.patchValue({ techRecord_grossLadenWeight: event.techRecord_grossLadenWeight }, { emitEvent: false });
          this.formChange.emit(event);
          updateBrakeForces({ grossLadenWeight: event.techRecord_grossLadenWeight, grossKerbWeight: event.techRecord_grossKerbWeight });
          return;
        }
        this.handleFormChanges(event);
      }),
    );
  }

  private handleFormChanges(event: any): void {
    if (this.isPsv && this.determineRecalculationNeeded(event) && this.form.value.techRecord_manufactureYear) {
      event.techRecord_grossLadenWeight = this.calculateGrossLadenWeight();
      this.form.get('techRecord_grossLadenWeight')?.setValue(event.techRecord_grossLadenWeight, { emitEvent: false });
    }

    this.formChange.emit(event);
    if (event?.techRecord_grossLadenWeight || event?.techRecord_grossKerbWeight) {
      this.store.dispatch(
        updateBrakeForces({ grossLadenWeight: event.techRecord_grossLadenWeight, grossKerbWeight: event.techRecord_grossKerbWeight }),
      );
    }
  }

  private determineRecalculationNeeded(event: Record<string, unknown>): boolean {
    return ['techRecord_seatsUpperDeck', 'techRecord_seatsLowerDeck', 'techRecord_manufactureYear', 'techRecord_grossKerbWeight'].some(
      (field) => event[`${field}`] !== undefined,
    );
  }

  calculateGrossLadenWeight(): number {
    const psvRecord = this.vehicleTechRecord as TechRecordType<'psv'>;
    const techRecord_seatsUpperDeck = psvRecord?.techRecord_seatsUpperDeck ?? 0;
    const techRecord_seatsLowerDeck = psvRecord?.techRecord_seatsLowerDeck ?? 0;
    const techRecord_manufactureYear = psvRecord?.techRecord_manufactureYear ?? 0;
    const techRecord_grossKerbWeight = psvRecord?.techRecord_grossKerbWeight ?? 0;
    const techRecord_standingCapacity = psvRecord?.techRecord_standingCapacity ?? 0;
    const kgAllowedPerPerson = techRecord_manufactureYear >= 1988 ? 65 : 63.5;

    const totalPassengers = techRecord_seatsUpperDeck + techRecord_seatsLowerDeck + techRecord_standingCapacity + 1; // Add 1 for the driver
    return Math.ceil(totalPassengers * kgAllowedPerPerson + techRecord_grossKerbWeight);
  }

  getAxleForm(i: number): CustomFormGroup {
    return this.axles.get([i]) as CustomFormGroup;
  }

  addAxle(): void {
    if (!this.vehicleTechRecord.techRecord_axles || this.vehicleTechRecord.techRecord_axles.length < 10) {
      this.isError = false;
      this.store.dispatch(addAxle());
    } else {
      this.isError = true;
      this.errorMessage = `Cannot have more than ${10} axles`;
    }
  }

  removeAxle(index: number): void {
    const minLength = this.isTrl ? 1 : 2;
    const axles = this.vehicleTechRecord.techRecord_axles;

    if (axles && axles.length > minLength) {
      this.isError = false;
      this.store.dispatch(removeAxle({ index }));
    } else {
      this.isError = true;
      this.errorMessage = `Cannot have less than ${minLength} axles`;
    }
  }
}
