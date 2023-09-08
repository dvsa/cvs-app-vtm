import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CustomFormGroup, FormNode, FormNodeEditTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { debounceTime, Subject, Subscription, takeUntil } from 'rxjs';
import { HgvAndTrlTypeApprovalTemplate } from '@forms/templates/general/approval-type.template';
import { PsvTypeApprovalTemplate } from '@forms/templates/psv/psv-approval-type.template';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { approvalType, VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechRecord } from '@api/vehicle';

import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { PsvWeightsTemplate } from '@forms/templates/psv/psv-weight.template';
import { HgvWeight } from '@forms/templates/hgv/hgv-weight.template';
import { TrlWeight } from '@forms/templates/trl/trl-weight.template';

@Component({
  selector: 'app-approval-type[techRecord]',
  templateUrl: './approval-type.component.html',
  styleUrls: ['./approval-type.component.scss']
})
export class ApprovalTypeComponent implements OnInit, OnChanges, OnDestroy {
  @Input() techRecord!: TechRecordType<'trl'> | TechRecordType<'psv'> | TechRecordType<'hgv'>;
  @Input() isEditing = false;
  @Output() formChange = new EventEmitter();
  @Output() approvalTypeNumberChange = new EventEmitter<string>();

  public form!: CustomFormGroup;
  private destroy$ = new Subject<void>();
  inputControls: FormControl[] = [];
  protected chosenApprovalType: string | undefined;
  formControls: { [key: string]: FormControl } = {};

  constructor(private dfs: DynamicFormService, private globalErrorService: GlobalErrorService, private formBuilder: FormBuilder) {}

  ngOnInit() {
    console.log(`VEHICLE TYPE: ${this.techRecord.techRecord_vehicleType}`);
    this.form = this.dfs.createForm(
      this.techRecord.techRecord_vehicleType === 'psv' ? PsvTypeApprovalTemplate : HgvAndTrlTypeApprovalTemplate,
      this.techRecord
    ) as CustomFormGroup;
    this.form.cleanValueChanges.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe(e => this.formChange.emit(e));

    Object.keys(this.form.controls).forEach(key => {
      this.formControls[key] = this.form.get(key) as FormControl;
    });

    this.inputControls = [
      this.form.get('techRecord_approvalType') as FormControl,
      this.form.get('techRecord_approvalTypeNumber') as FormControl,
      this.form.get('techRecord_ntaNumber') as FormControl,
      this.form.get('techRecord_variantNumber') as FormControl,
      this.form.get('techRecord_variantVersionNumber') as FormControl
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(`ng changes ${JSON.stringify(this.approvalType)}`);
    const { techRecord } = changes;
    if (this.form && techRecord?.currentValue && techRecord.currentValue !== techRecord.previousValue) {
      this.form.patchValue(techRecord.currentValue, { emitEvent: false });
      this.chosenApprovalType = techRecord.currentValue.techRecord_approvalType ? techRecord.currentValue.techRecord_approvalType : '';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get template(): FormNode {
    switch (this.techRecord.techRecord_vehicleType) {
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

  get editTypes(): typeof FormNodeEditTypes {
    return FormNodeEditTypes;
  }

  get widths(): typeof FormNodeWidth {
    return FormNodeWidth;
  }

  get isPsv(): boolean {
    return this.techRecord.techRecord_vehicleType === VehicleTypes.PSV;
  }

  protected readonly TechRecord = TechRecord;
  protected readonly getOptionsFromEnum = getOptionsFromEnum;
  protected readonly approvalType = approvalType;
  protected readonly console = console;
}
