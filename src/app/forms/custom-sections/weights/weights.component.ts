import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { HgvWeight } from '@forms/templates/hgv/hgv-weight.template';
import { PsvWeightsTemplate } from '@forms/templates/psv/psv-weight.template';
import { TrlWeight } from '@forms/templates/trl/trl-weight.template';
import { Axle, TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
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
  @Input() vehicleTechRecord!: TechRecordModel;
  @Input() isEditing = false;

  @Output() formChange = new EventEmitter();

  public form!: CustomFormGroup;
  private _formSubscription = new Subscription();
  public isError: boolean = false;
  public errorMessage?: string;

  constructor(public dynamicFormsService: DynamicFormService, private store: Store<TechnicalRecordServiceState>) {}

  ngOnInit(): void {
    this.form = this.dynamicFormsService.createForm(this.template, this.vehicleTechRecord) as CustomFormGroup;
    this._formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe((event: any) => {
      if (event?.axles) {
        event.axles = (event.axles as Axle[]).filter(axle => !!axle?.axleNumber);
      }

      this.formChange.emit(event);

      if (event.grossLadenWeight || event.grossKerbWeight) {
        this.store.dispatch(updateBrakeForces({ grossLadenWeight: event.grossLadenWeight, grossKerbWeight: event.grossKerbWeight }));
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { vehicleTechRecord } = changes;

    if (this.form && vehicleTechRecord?.currentValue && vehicleTechRecord.currentValue !== vehicleTechRecord.previousValue) {
      this.form?.patchValue(vehicleTechRecord.currentValue, { emitEvent: false });
    }
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  get template(): FormNode {
    switch (this.vehicleTechRecord.vehicleType) {
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
    return this.vehicleTechRecord.vehicleType === VehicleTypes.PSV;
  }

  get isHgv(): boolean {
    return this.vehicleTechRecord.vehicleType === VehicleTypes.HGV;
  }

  get isTrl(): boolean {
    return this.vehicleTechRecord.vehicleType === VehicleTypes.TRL;
  }

  get types(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get axles(): CustomFormArray {
    return this.form.get(['axles']) as CustomFormArray;
  }

  getAxleWeights(i: number): CustomFormGroup {
    return this.axles.get([i, 'weights']) as CustomFormGroup;
  }

  addAxle(): void {
    if (this.vehicleTechRecord.axles!.length < 10) {
      this.isError = false;
      this.store.dispatch(addAxle());
    } else {
      this.isError = true;
      this.errorMessage = `Cannot have more than ${10} axles`;
    }
  }

  removeAxle(index: number): void {
    const minLength = this.isTrl ? 1 : 2;

    if (this.vehicleTechRecord.axles!.length > minLength) {
      this.isError = false;
      this.store.dispatch(removeAxle({ index }));
    } else {
      this.isError = true;
      this.errorMessage = `Cannot have less than ${minLength} axles`;
    }
  }
}
