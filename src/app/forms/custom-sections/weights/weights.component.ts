import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { HgvWeight } from '@forms/templates/hgv/hgv-weight.template';
import { PsvWeightsTemplate } from '@forms/templates/psv/psv-weight.template';
import { TrlWeight } from '@forms/templates/trl/trl-weight.template';
import { Axle, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { addAxle, removeAxle, updateBrakeForces } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-weights[vehicleTechRecord]',
  templateUrl: './weights.component.html',
  styleUrls: ['./weights.component.scss']
})
export class WeightsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() vehicleTechRecord!: TechRecordType<'psv'> | TechRecordType<'trl'> | TechRecordType<'hgv'>;
  @Input() isEditing = false;

  @Output() formChange = new EventEmitter();

  public form!: CustomFormGroup;
  private _formSubscription = new Subscription();
  public isError: boolean = false;
  public errorMessage?: string;
  private ladenWeightOverride: boolean = false;

  constructor(public dynamicFormsService: DynamicFormService, private store: Store<TechnicalRecordServiceState>) {}

  ngOnInit(): void {
    this.form = this.dynamicFormsService.createForm(this.template, this.vehicleTechRecord) as CustomFormGroup;

    const grossLadenWeightChanges = this.form.get('techRecord_grossLadenWeight')?.valueChanges.subscribe(() => {
      this.ladenWeightOverride = true;
    });
    if (grossLadenWeightChanges) {
      this._formSubscription.add(grossLadenWeightChanges);
    }

    this._formSubscription.add(
      this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe((event: any) => {
        if (this.ladenWeightOverride) return;

        const {
          techRecord_seatsUpperDeck,
          techRecord_seatsLowerDeck,
          techRecord_manufactureYear,
          techRecord_grossKerbWeight,
          techRecord_grossLadenWeight
        } = event || {};

        const shouldRecalculate =
          techRecord_seatsUpperDeck !== undefined ||
          techRecord_seatsLowerDeck !== undefined ||
          techRecord_manufactureYear !== undefined ||
          techRecord_grossKerbWeight !== undefined;

        if (shouldRecalculate) {
          this.ladenWeightOverride = false;
        }

        if (event?.techRecord_axles) {
          event.techRecord_axles = (event.techRecord_axles as Axle[]).filter(axle => !!axle?.axleNumber);
        }

        if (this.isPsv && !this.ladenWeightOverride && shouldRecalculate) {
          const calculatedWeight = this.calculateGrossLadenWeight();
          event.techRecord_grossLadenWeight = calculatedWeight;
          this.form.get('techRecord_grossLadenWeight')?.setValue(calculatedWeight, { emitEvent: false });
        }
        this.formChange.emit(event);

        if (techRecord_grossLadenWeight || techRecord_grossKerbWeight) {
          this.store.dispatch(updateBrakeForces({ grossLadenWeight: techRecord_grossLadenWeight, grossKerbWeight: techRecord_grossKerbWeight }));
        }
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { vehicleTechRecord } = changes;
    if (this.form && vehicleTechRecord && !this.ladenWeightOverride) {
      const { currentValue, previousValue } = vehicleTechRecord;

      const fieldsChanged = [
        'techRecord_seatsUpperDeck',
        'techRecord_seatsLowerDeck',
        'techRecord_manufactureYear',
        'techRecord_grossKerbWeight'
      ].some(field => currentValue[field] !== previousValue[field]);

      if (fieldsChanged) {
        const newGrossLadenWeight = this.calculateGrossLadenWeight();

        this.form.patchValue(
          {
            techRecord_grossLadenWeight: newGrossLadenWeight
          },
          { emitEvent: false }
        );
      }
    }
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
    return this.vehicleTechRecord.techRecord_vehicleType !== VehicleTypes.PSV && this.isEditing;
  }

  get types(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get axles(): CustomFormArray {
    return this.form.get(['techRecord_axles']) as CustomFormArray;
  }

  getAxleForm(i: number): CustomFormGroup {
    return this.axles.get([i]) as CustomFormGroup;
  }

  addAxle(): void {
    if (!this.vehicleTechRecord.techRecord_axles || this.vehicleTechRecord.techRecord_axles!.length < 10) {
      this.isError = false;
      this.store.dispatch(addAxle());
    } else {
      this.isError = true;
      this.errorMessage = `Cannot have more than ${10} axles`;
    }
  }

  removeAxle(index: number): void {
    const minLength = this.isTrl ? 1 : 2;

    if (this.vehicleTechRecord.techRecord_axles!.length > minLength) {
      this.isError = false;
      this.store.dispatch(removeAxle({ index }));
    } else {
      this.isError = true;
      this.errorMessage = `Cannot have less than ${minLength} axles`;
    }
  }

  calculateGrossLadenWeight(): number {
    const psvRecord = this.vehicleTechRecord as TechRecordType<'psv'>;
    const techRecord_seatsUpperDeck = psvRecord?.techRecord_seatsUpperDeck ?? 0;
    const techRecord_seatsLowerDeck = psvRecord?.techRecord_seatsLowerDeck ?? 0;
    const techRecord_manufactureYear = psvRecord?.techRecord_manufactureYear ?? 0;
    const techRecord_grossKerbWeight = psvRecord?.techRecord_grossKerbWeight ?? 0;
    const kgAllowedPerPerson = techRecord_manufactureYear >= 1988 ? 65 : 63.5;

    const totalPassengers = techRecord_seatsUpperDeck + techRecord_seatsLowerDeck + 1; // Add 1 for the driver
    return totalPassengers * kgAllowedPerPerson + techRecord_grossKerbWeight;
  }
}
