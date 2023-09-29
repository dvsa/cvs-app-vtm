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
  private isProgrammaticChange: boolean = false;

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
    this.subscribeToGrossLadenWeightChanges();
  }

  private subscribeToFieldsForGrossLadenWeightRecalculation(): void {
    const fields = [
      'techRecord_seatsUpperDeck',
      'techRecord_seatsLowerDeck',
      'techRecord_manufactureYear',
      'techRecord_grossKerbWeight',
      'techRecord_standingCapacity'
    ];

    fields.forEach(field => {
      this.form.get(field)?.valueChanges.subscribe(() => {
        if (!this.ladenWeightOverride && this.form.value.techRecord_manufactureYear) {
          const newGrossLadenWeight = this.calculateGrossLadenWeight();
          this.isProgrammaticChange = true;
          this.form.patchValue({ techRecord_grossLadenWeight: newGrossLadenWeight }, { emitEvent: false });
          this.isProgrammaticChange = false;
        }
      });
    });
  }

  private handleVehicleTechRecordChange(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['vehicleTechRecord'] && !this.ladenWeightOverride && this.form) {
      const { currentValue, previousValue } = changes['vehicleTechRecord'];
      const fieldsChanged = [
        'techRecord_seatsUpperDeck',
        'techRecord_seatsLowerDeck',
        'techRecord_manufactureYear',
        'techRecord_grossKerbWeight',
        'techRecord_standingCapacity'
      ].some(field => {
        console.log(currentValue[field]);
        console.log(previousValue[field]);
        return currentValue[field] !== previousValue[field]; // Add the return statement here
      });
      console.log(`files changed ${fieldsChanged}`);

      if (fieldsChanged && currentValue.techRecord_manufactureYear) {
        const newGrossLadenWeight = this.calculateGrossLadenWeight();
        console.log(`new gross laden weight: ${newGrossLadenWeight}`);
        this.form.patchValue({ techRecord_grossLadenWeight: newGrossLadenWeight }, { emitEvent: false });
      }
    }
  }

  private subscribeToFormChanges(): void {
    this._formSubscription.add(
      this.form.cleanValueChanges.subscribe((event: any) => {
        console.log(event);
        if (this.ladenWeightOverride) {
          // If overridden, update the store and return.
          if (event?.techRecord_grossLadenWeight) {
            this.form.get('techRecord_grossLadenWeight')?.setValue(event?.techRecord_grossLadenWeight, { emitEvent: false });
            this.store.dispatch(updateBrakeForces({ grossLadenWeight: event.techRecord_grossLadenWeight }));
          }
          return;
        }
        console.log('handle form changes');
        this.handleFormChanges(event);
      })
    );
  }

  private handleFormChanges(event: any): void {
    const shouldRecalculate = this.determineRecalculationNeeded(event);

    console.log(`should recalculate ${shouldRecalculate}`);
    console.log(`laden weight override ${this.ladenWeightOverride}`);

    if (this.isPsv && !this.ladenWeightOverride && shouldRecalculate && this.form.value.techRecord_manufactureYear) {
      const calculatedWeight = this.calculateGrossLadenWeight();
      event.techRecord_grossLadenWeight = calculatedWeight;
      console.log(`calculated weight ${calculatedWeight}`);
      this.form.get('techRecord_grossLadenWeight')?.setValue(calculatedWeight, { emitEvent: false });
    }

    this.formChange.emit(event);

    console.log(event);
    if (event?.techRecord_grossLadenWeight || event?.techRecord_grossKerbWeight) {
      console.log('updating store');
      this.store.dispatch(
        updateBrakeForces({ grossLadenWeight: event.techRecord_grossLadenWeight, grossKerbWeight: event.techRecord_grossKerbWeight })
      );
    }
  }

  private determineRecalculationNeeded(event: any): boolean {
    return ['techRecord_seatsUpperDeck', 'techRecord_seatsLowerDeck', 'techRecord_manufactureYear', 'techRecord_grossKerbWeight'].some(
      field => event[field] !== undefined
    );
  }

  private subscribeToGrossLadenWeightChanges(): void {
    const grossLadenWeightChanges = this.form.get('techRecord_grossLadenWeight')?.valueChanges.subscribe(() => {
      if (!this.isProgrammaticChange) {
        this.ladenWeightOverride = true;
      }
    });

    if (grossLadenWeightChanges) {
      this._formSubscription.add(grossLadenWeightChanges);
    }
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
    const techRecord_standingCapacity = psvRecord?.techRecord_standingCapacity ?? 0;
    const kgAllowedPerPerson = techRecord_manufactureYear >= 1988 ? 65 : 63.5;

    console.log(`seats upper: ${techRecord_seatsUpperDeck}`);
    console.log(`seats lower: ${techRecord_seatsLowerDeck}`);
    console.log(`manufacture year: ${techRecord_manufactureYear}`);
    console.log(`gross kerb weight: ${techRecord_grossKerbWeight}`);
    console.log(`standing capacity: ${techRecord_standingCapacity}`);
    const totalPassengers = techRecord_seatsUpperDeck + techRecord_seatsLowerDeck + techRecord_standingCapacity + 1; // Add 1 for the driver
    return totalPassengers * kgAllowedPerPerson + techRecord_grossKerbWeight;
  }
}
