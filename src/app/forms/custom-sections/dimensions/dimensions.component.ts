import {
  Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
} from '@angular/core';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import {
  CustomFormArray,
  CustomFormControl,
  CustomFormGroup,
  FormNode,
  FormNodeEditTypes,
  FormNodeWidth,
} from '@forms/services/dynamic-form.types';
import { HgvDimensionsTemplate } from '@forms/templates/hgv/hgv-dimensions.template';
import { PsvDimensionsTemplate } from '@forms/templates/psv/psv-dimensions.template';
import { TrlDimensionsTemplate } from '@forms/templates/trl/trl-dimensions.template';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { WarningsEnum } from '@shared/enums/warnings.enum';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { DimensionLabelEnum } from '@shared/enums/dimension-label.enum';

@Component({
  selector: 'app-dimensions',
  templateUrl: './dimensions.component.html',
  styleUrls: ['./dimensions.component.scss'],
})
export class DimensionsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() techRecord!: TechRecordType<'trl'> | TechRecordType<'psv'> | TechRecordType<'hgv'>;
  @Input() isEditing = false;
  @Output() formChange = new EventEmitter();

  form!: CustomFormGroup;

  private destroy$ = new Subject<void>();

  constructor(private dfs: DynamicFormService) {}

  ngOnInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.form = this.dfs.createForm(this.template!, this.techRecord) as CustomFormGroup;

    this.form.cleanValueChanges.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe((e) => {
      this.initialiseWarnings();
      this.formChange.emit(e);
    });
  }

  initialiseWarnings() {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const controlKey in this.form.controls) {
      const control = this.form.get(controlKey);
      if (control instanceof CustomFormControl) {
        if (this.techRecord.techRecord_vehicleType === 'hgv' || this.techRecord.techRecord_vehicleType === 'trl') {
          if (this.isLengthLabel(control)) {
            this.handleWarningChange(control, this.shouldDisplayLengthWarning(control), WarningsEnum.DIMENSIONS_LENGTH_WARNING);
          }
          if (this.isWidthLabel(control)) {
            this.handleWarningChange(control, this.shouldDisplayWidthWarning(control), WarningsEnum.DIMENSIONS_WIDTH_WARNING);
          }
        }
      }
    }
  }

  handleWarningChange(control: CustomFormControl, shouldDisplay: boolean, warning: WarningsEnum) {
    control.meta.warning = shouldDisplay ? warning : undefined;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { techRecord } = changes;

    if (this.form && techRecord?.currentValue && techRecord.currentValue !== techRecord.previousValue) {
      this.form.patchValue(techRecord.currentValue, { emitEvent: false });
    }
  }

  isLengthLabel(control: CustomFormControl): boolean {
    return control.meta.label === DimensionLabelEnum.LENGTH;
  }

  isWidthLabel(control: CustomFormControl): boolean {
    return control.meta.label === DimensionLabelEnum.WIDTH;
  }
  shouldDisplayLengthWarning(control: CustomFormControl): boolean {
    return parseInt(control.value, 10) > 12000;
  }
  shouldDisplayWidthWarning(control: CustomFormControl): boolean {
    return parseInt(control.value, 10) > 2600;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get template(): FormNode | undefined {
    switch (this.techRecord.techRecord_vehicleType) {
      case VehicleTypes.PSV:
        return PsvDimensionsTemplate;
      case VehicleTypes.HGV:
        return HgvDimensionsTemplate;
      case VehicleTypes.TRL:
        return TrlDimensionsTemplate;
      default:
        return undefined;
    }
  }

  get isPsv(): boolean {
    return this.techRecord.techRecord_vehicleType === VehicleTypes.PSV;
  }

  get isTrl(): boolean {
    return this.techRecord.techRecord_vehicleType === VehicleTypes.TRL;
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

  get hasAxleSpacings(): boolean {
    if (this.techRecord.techRecord_vehicleType === 'psv') {
      return false;
    }
    return !!this.techRecord.techRecord_dimensions_axleSpacing?.length;
  }

  get axleSpacings(): CustomFormArray {
    return this.form.get(['techRecord_dimensions_axleSpacing']) as CustomFormArray;
  }

  getAxleSpacing(i: number): CustomFormGroup {
    return this.form.get(['techRecord_dimensions_axleSpacing', i]) as CustomFormGroup;
  }
}
