import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CustomFormGroup, FormNode, FormNodeEditTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { HgvAndTrlTypeApprovalTemplate } from '@forms/templates/general/approval-type.template';
import { PsvTypeApprovalTemplate } from '@forms/templates/psv/psv-approval-type.template';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { approvalType, VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechRecord } from '@api/vehicle';

import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { FormControl } from '@angular/forms';

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
  protected chosenApprovalType: string | undefined;
  protected approvalTypeChange: boolean = false;
  formControls: { [key: string]: FormControl } = {};

  constructor(private dfs: DynamicFormService) {}

  ngOnInit() {
    this.form = this.dfs.createForm(
      this.techRecord.techRecord_vehicleType === 'psv' ? PsvTypeApprovalTemplate : HgvAndTrlTypeApprovalTemplate,
      this.techRecord
    ) as CustomFormGroup;
    console.log(this.techRecord);
    this.form.cleanValueChanges.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe(e => this.formChange.emit(e));
    Object.keys(this.form.controls).forEach(key => {
      this.formControls[key] = this.form.get(key) as FormControl;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { techRecord } = changes;
    if (this.form && techRecord?.currentValue && techRecord.currentValue !== techRecord.previousValue) {
      this.form.patchValue(techRecord.currentValue, { emitEvent: false });
      this.chosenApprovalType = techRecord.currentValue.techRecord_approvalType ? techRecord.currentValue.techRecord_approvalType : '';
      techRecord.currentValue.techRecord_coifDate = techRecord.currentValue.techRecord_coifDate
        ? techRecord.currentValue.techRecord_coifDate.split('T')[0]
        : '';

      console.log(this.chosenApprovalType);
      console.log(this.techRecord.techRecord_approvalType);
      console.log(this.techRecord);
      console.log(techRecord.currentValue.techRecord_approvalTypeNumber);
      console.log(techRecord.previousValue.techRecord_approvalTypeNumber);
      console.log(this.techRecord.techRecord_approvalTypeNumber);
      if (
        techRecord.currentValue.techRecord_approvalType != techRecord.previousValue.techRecord_approvalType &&
        techRecord.previousValue.techRecord_approvalType != null
      ) {
        console.log('apparoval type change true');
        this.approvalTypeChange = true;
      }
      if (techRecord.currentValue.techRecord_approvalType == techRecord.previousValue.techRecord_approvalType) {
        {
          console.log('approval type change fasel');
          this.approvalTypeChange = false;
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get template(): FormNode {
    switch (this.techRecord.techRecord_vehicleType) {
      case VehicleTypes.PSV:
        return PsvTypeApprovalTemplate;
      case VehicleTypes.HGV:
        return HgvAndTrlTypeApprovalTemplate;
      case VehicleTypes.TRL:
        return HgvAndTrlTypeApprovalTemplate;
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
}
