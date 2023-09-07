import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CustomFormGroup, FormNode, FormNodeEditTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { HgvAndTrlTypeApprovalTemplate } from '@forms/templates/general/approval-type.template';
import { PsvTypeApprovalTemplate } from '@forms/templates/psv/psv-approval-type.template';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { approvalType, VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechRecord } from '@api/vehicle';
import ApprovalTypeEnum = TechRecord.ApprovalTypeEnum;
import { getOptionsFromEnum } from '@forms/utils/enum-map';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { approvalTypeNumberFormatValidator } from '@forms/validators/type-approval/type-approval.validators';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { PsvWeightsTemplate } from '@forms/templates/psv/psv-weight.template';
import { HgvWeight } from '@forms/templates/hgv/hgv-weight.template';
import { TrlWeight } from '@forms/templates/trl/trl-weight.template';

@Component({
  selector: 'app-approval-type[techRecord]',
  templateUrl: './approval-type.component.html',
  styleUrls: ['./approval-type.component.html']
})
export class ApprovalTypeComponent implements OnInit, OnChanges, OnDestroy {
  @Input() techRecord!: TechRecordType<'trl'> | TechRecordType<'psv'> | TechRecordType<'hgv'>;
  @Input() isEditing = false;
  @Output() formChange = new EventEmitter();
  @Output() approvalTypeNumberChange = new EventEmitter<string>();

  @ViewChild('techRecord_approvalTypeNumber') approvalTypeNumberInput!: ElementRef;
  @ViewChild('techRecord_ntaNumber') ntaNumberInput!: ElementRef;
  @ViewChild('techRecord_variantNumber') variantNumberInput!: ElementRef;
  @ViewChild('techRecord_variantVersionNumber') variantVersionNumberInput!: ElementRef;

  // Separate properties for each part of the input
  editablePart1: string = '';
  editablePart2: string = '';
  editablePart3: string = '';
  editablePart4: string = '';
  editablePart5: string = '';
  editablePart6: string = '';

  public form!: CustomFormGroup;
  private destroy$ = new Subject<void>();
  inputElements: ElementRef[] = [];
  inputControls: FormControl[] = [];

  constructor(private dfs: DynamicFormService, private globalErrorService: GlobalErrorService) {}

  ngOnInit() {
    console.log(`VEHICLE TYPE: ${this.techRecord.techRecord_vehicleType}`);
    this.form = this.dfs.createForm(
      this.techRecord.techRecord_vehicleType === 'psv' ? PsvTypeApprovalTemplate : HgvAndTrlTypeApprovalTemplate,
      this.techRecord
    ) as CustomFormGroup;
    this.form.cleanValueChanges.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe(e => this.formChange.emit(e));
    this.form.cleanValueChanges.pipe(debounceTime(400), takeUntil(this.destroy$)).subscribe(e => this.formChange.emit(e));

    this.inputControls = [
      this.form.get('techRecord_approvalTypeNumber') as FormControl,
      this.form.get('techRecord_ntaNumber') as FormControl,
      this.form.get('techRecord_variantNumber') as FormControl,
      this.form.get('techRecord_variantVersionNumber') as FormControl
    ];
    // / In your ngOnInit method, add the custom validator to the "Approval type number" field based on the selected "Approval type"
    const approvalTypeControl = this.form.get('techRecord_approvalType');
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { techRecord } = changes;
    if (this.form && techRecord?.currentValue && techRecord.currentValue !== techRecord.previousValue) {
      this.form.patchValue(techRecord.currentValue, { emitEvent: false });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Modified function that accepts FormGroup and character limit parameters
  moveToNextInput(formGroup: FormGroup, controlName: string, maxLength: number) {
    const control = formGroup.get(controlName);
    console.log('controlName:', controlName);
    console.log('maxLength:', maxLength);
    if (control && control.value.length >= maxLength) {
      const currentIndex = this.inputControls.findIndex(ctrl => ctrl === control);

      if (currentIndex < this.inputControls.length - 1) {
        const nextInput = this.inputElements[currentIndex + 1];
        if (nextInput) {
          nextInput.nativeElement.focus();
        }
      }
    }
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

  // Handle changes in each part of the input
  onPart1Change() {
    this.formatAndEmitApprovalTypeNumber();
  }

  onPart2Change() {
    this.formatAndEmitApprovalTypeNumber();
  }

  onPart3Change() {
    this.formatAndEmitApprovalTypeNumber();
  }

  onPart4Change() {
    this.formatAndEmitApprovalTypeNumber();
  }

  onPart5Change() {
    this.formatAndEmitApprovalTypeNumber();
  }

  onPart6Change() {
    this.formatAndEmitApprovalTypeNumber();
  }

  // Implement formatting logic based on the selected approval type
  private formatAndEmitApprovalTypeNumber() {
    let formattedValue = '';

    switch (this.approvalType as unknown as String) {
      case 'ECTA':
        formattedValue = `e${this.editablePart1}*${this.editablePart2}/${this.editablePart3}*${this.editablePart4}${this.editablePart5}${this.editablePart6}`;
        break;

      case 'NSSTA':
        formattedValue = `e${this.editablePart1}*NKS*${this.editablePart2}${this.editablePart3}${this.editablePart4}${this.editablePart5}${this.editablePart6}`;
        break;

      case 'ECSSTA':
        formattedValue = `e${this.editablePart1}*KSXX/${this.editablePart2}*${this.editablePart3}${this.editablePart4}${this.editablePart5}${this.editablePart6}`;
        break;

      case 'GB WVTA':
        formattedValue = `${this.editablePart1}${this.editablePart2}${this.editablePart3}*${this.editablePart4}/${this.editablePart5}*${this.editablePart6}`;
        break;

      case 'UKNI WVTA':
        formattedValue = `X11*${this.editablePart1}${this.editablePart2}${this.editablePart3}/${this.editablePart4}*${this.editablePart5}${this.editablePart6}`;
        break;

      case 'EU WVTA Pre 23':
      case 'EU WVTA 23 on':
      case 'QNIG':
        formattedValue = `e${this.editablePart1}*${this.editablePart2}/${this.editablePart3}*${this.editablePart4}${this.editablePart5}${this.editablePart6}`;
        break;

      case 'Prov.GB WVTA':
        formattedValue = `${this.editablePart1}${this.editablePart2}${this.editablePart3}*${this.editablePart4}/${this.editablePart5}*${this.editablePart6}`;
        break;

      case 'Small series':
        formattedValue = `X11*NKS*${this.editablePart1}${this.editablePart2}${this.editablePart3}${this.editablePart4}${this.editablePart5}${this.editablePart6}`;
        break;

      case 'IVA – VCA':
        formattedValue = `n11*NIV${this.editablePart1}${this.editablePart2}/${this.editablePart3}*${this.editablePart4}${this.editablePart5}${this.editablePart6}`;
        break;

      case 'IVA – DVSA/NI':
        // No specific formatting for IVA – DVSA/NI
        formattedValue = '';
        break;

      default:
        // No specific format required for other "Approval type" values
        formattedValue = '';
        break;
    }

    this.approvalTypeNumberChange.emit(formattedValue);
  }

  protected readonly TechRecord = TechRecord;
  protected readonly ApprovalTypeEnum = ApprovalTypeEnum;
  protected readonly getOptionsFromEnum = getOptionsFromEnum;
  protected readonly approvalType = approvalType;
  protected readonly console = console;
}
