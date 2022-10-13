import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeEditTypes } from '@forms/services/dynamic-form.types';
import { getDimensionsSection } from '@forms/templates/general/dimensions.template';
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
  template!: FormNode;

  private destroy$ = new Subject<void>();

  constructor(private dfs: DynamicFormService) {}

  ngOnInit(): void {
    this.template = getDimensionsSection(
      this.vehicleTechRecord.vehicleType,
      this.vehicleTechRecord.noOfAxles,
      this.vehicleTechRecord.dimensions?.axleSpacing
    );

    this.form = this.dfs.createForm(this.template, this.vehicleTechRecord) as CustomFormGroup;

    this.form.cleanValueChanges
      .pipe(debounceTime(400), takeUntil(this.destroy$))
      .subscribe(e => this.formChange.emit(e));
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { data } =  changes;

    if (data?.currentValue && data.currentValue !== data.previousValue) {
      this.form.patchValue(data.currentValue, { emitEvent: false });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isPsv(): boolean {
    return this.vehicleTechRecord.vehicleType === VehicleTypes.PSV;
  }

  get isTrl(): boolean {
    return this.vehicleTechRecord.vehicleType === VehicleTypes.TRL;
  }

  get types(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get dimensions(): FormGroup {
    return this.form.get(['dimensions']) as FormGroup;
  }

  get bottomSection(): CustomFormGroup {
    return this.form.get(['dimensionsBottomSection', 'dimensions']) as CustomFormGroup;
  }
}
