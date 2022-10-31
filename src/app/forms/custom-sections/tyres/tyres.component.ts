import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { MultiOptions } from '@forms/models/options.model';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup, FormNodeEditTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { getTyresSection } from '@forms/templates/general/tyres.template';
import { Axle, fitmentCodeAsOptions, speedCategorySymbolAsOptions, TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Subscription, debounceTime } from 'rxjs';

@Component({
  selector: 'app-tyres',
  templateUrl: './tyres.component.html',
  styleUrls: ['./tyres.component.scss']
})
export class TyresComponent implements OnInit, OnDestroy, OnChanges {
  @Input() vehicleTechRecord!: TechRecordModel;
  @Input() isEditing = false;
  public isError: boolean = false;
  public errorMessage?: string;

  @Output() formChange = new EventEmitter();

  public form!: CustomFormGroup;
  private _formSubscription = new Subscription();

  constructor(public dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.vehicleTechRecord) as CustomFormGroup;
    this._formSubscription = this.form.cleanValueChanges.pipe(debounceTime(400)).subscribe(event => {
      this.formChange.emit(event);
    });
  }

  ngOnChanges() {
    this.form?.patchValue(this.vehicleTechRecord, { emitEvent: false });
  }

  ngOnDestroy(): void {
    this._formSubscription.unsubscribe();
  }

  get template() {
    return getTyresSection(this.vehicleTechRecord.vehicleType);
  }

  get isPsv(): boolean {
    return this.vehicleTechRecord.vehicleType === VehicleTypes.PSV;
  }

  get isHgvOrTrl(): boolean {
    return this.vehicleTechRecord.vehicleType === VehicleTypes.HGV || this.vehicleTechRecord.vehicleType === VehicleTypes.TRL;
  }

  get types(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get widths(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

  get speedCategorySymbol(): MultiOptions {
    return speedCategorySymbolAsOptions();
  }

  get fitmentCode(): MultiOptions {
    return fitmentCodeAsOptions();
  }

  get axles(): CustomFormArray {
    return this.form.get(['axles']) as CustomFormArray;
  }

  getAxleTyres(i: number): CustomFormGroup {
    return this.axles.get([i, 'tyres']) as CustomFormGroup;
  }

  addAxle(): void {
    const tyres = {
      tyreSize: null,
      speedCategorySymbol: null,
      fitmentCode: null,
      dataTrAxles: null,
      plyRating: null,
      tyreCode: null
    };

    const newAxle: Axle = {
      axleNumber: this.axles.length + 1,
      tyres: tyres
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
