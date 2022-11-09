import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNode, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { HgvWeight } from '@forms/templates/hgv/hgv-weight.template';
import { PsvWeight } from '@forms/templates/psv/psv-weight.template';
import { TrlWeight } from '@forms/templates/trl/trl-weight.template';
import { Axle, TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
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

  constructor(public dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.vehicleTechRecord) as CustomFormGroup;
    this._formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe(event => this.formChange.emit(event));
  }

  ngOnChanges(): void {
    this.form?.patchValue(this.vehicleTechRecord, { emitEvent: false });
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  get template(): FormNode {
    switch (this.vehicleTechRecord.vehicleType) {
      case VehicleTypes.PSV:
        return PsvWeight;
      case VehicleTypes.HGV:
        return HgvWeight;
      case VehicleTypes.TRL:
        return TrlWeight;
    }
  }

  get isPsv(): boolean {
    return this.vehicleTechRecord.vehicleType === VehicleTypes.PSV;
  }

  get isHgv(): boolean {
    return this.vehicleTechRecord.vehicleType === VehicleTypes.HGV;
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
    const weights = this.isPsv
      ? {
        kerbWeight: null,
        ladenWeight: null,
        gbWeight: null,
        designWeight: null
      }
      : {
        gbWeight: null,
        eecWeight: null,
        designWeight: null
      };

    const newAxle: Axle = {
      axleNumber: this.axles.length + 1,
      weights: weights
    };

    if (this.vehicleTechRecord.axles.length < 5) {
      this.isError = false;
      this.axles.addControl(newAxle);
    } else {
      this.isError = true;
      this.errorMessage = 'Cannot have more than 5 axles';
    }
  }

  removeAxle(index: number): void {
    if (this.vehicleTechRecord.axles.length > 2) {
      this.isError = false;
      this.axles.removeAt(index);
    } else {
      this.isError = true;
      this.errorMessage = 'Cannot have less than 1 axle';
    }
  }
}
