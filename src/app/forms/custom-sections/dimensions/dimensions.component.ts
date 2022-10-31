import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNodeEditTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { HgvDimensionsTemplate } from '@forms/templates/hgv/hgv-dimensions.template';
import { PsvDimensionsTemplate } from '@forms/templates/psv/psv-dimensions.template';
import { TrlDimensionsTemplate } from '@forms/templates/trl/trl-dimensions.template';
import { TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dimensions',
  templateUrl: './dimensions.component.html',
  styleUrls: ['./dimensions.component.scss']
})
export class DimensionsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() vehicleTechRecord!: TechRecordModel;
  @Input() isEditing = false;
  @Output() formChange = new EventEmitter();

  form!: CustomFormGroup;

  private destroy$ = new Subject<void>();

  constructor(private dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.form = this.dfs.createForm(this.template, this.vehicleTechRecord) as CustomFormGroup;

    this.form.cleanValueChanges
      .pipe(debounceTime(400), takeUntil(this.destroy$))
      .subscribe(e => this.formChange.emit(e));
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { vehicleTechRecord } =  changes;

    if (this.form && vehicleTechRecord?.currentValue && vehicleTechRecord.currentValue !== vehicleTechRecord.previousValue) {
      this.form.patchValue(vehicleTechRecord.currentValue, { emitEvent: false });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get template() {
    switch (this.vehicleTechRecord.vehicleType) {
      case VehicleTypes.PSV:
        return PsvDimensionsTemplate;
      case VehicleTypes.HGV:
        return HgvDimensionsTemplate;
      case VehicleTypes.TRL:
        return TrlDimensionsTemplate;
    }
  }

  get isPsv(): boolean {
    return this.vehicleTechRecord.vehicleType === VehicleTypes.PSV;
  }

  get isTrl(): boolean {
    return this.vehicleTechRecord.vehicleType === VehicleTypes.TRL;
  }

  get widths(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

  get types(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get dimensions(): CustomFormGroup {
    return this.form.get(['dimensions']) as CustomFormGroup;
  }

  get axleSpacings(): CustomFormGroup {
    return this.form.get(['dimensions', 'axleSpacing']) as CustomFormGroup;
  }

  getAxleSpacing(i: number): CustomFormGroup {
    return this.form.get(['dimensions', 'axleSpacing', i]) as CustomFormGroup;
  }
}
