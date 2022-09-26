import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Roles } from '@models/roles.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TechRecordModel, VehicleTechRecordModel, VehicleTypes, Vrm } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { Observable } from 'rxjs';
import { TechRecordSummaryComponent } from '../tech-record-summary/tech-record-summary.component';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { CustomFormArray, CustomFormGroup } from '@forms/services/dynamic-form.types';

@Component({
  selector: 'app-vehicle-technical-record',
  templateUrl: './vehicle-technical-record.component.html'
})
export class VehicleTechnicalRecordComponent implements OnInit, AfterViewInit {
  @ViewChild(TechRecordSummaryComponent) dynamicForm!: TechRecordSummaryComponent;
  @Input() vehicleTechRecord?: VehicleTechRecordModel;

  currentTechRecord$!: Observable<TechRecordModel | undefined>;
  records$: Observable<TestResultModel[]>;

  isEditable: boolean = false;
  isDirty: boolean = false;
  isInvalid: boolean = false;

  constructor(testRecordService: TestRecordsService, private technicalRecordService: TechnicalRecordService, private errorService: GlobalErrorService) {
    this.records$ = testRecordService.testRecords$;
  }

  ngAfterViewInit(): void {
        this.handleFormState()
    }

  ngOnInit(): void {
    this.currentTechRecord$ = this.technicalRecordService.viewableTechRecord$(this.vehicleTechRecord!);
  }

  get currentVrm(): string | undefined {
    return this.vehicleTechRecord?.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
  }

  get otherVrms(): Vrm[] | undefined {
    return this.vehicleTechRecord?.vrms.filter(vrm => vrm.isPrimary === false);
  }

  public get roles() {
    return Roles;
  }

  get vehicleTypes() {
    return VehicleTypes;
  }

  handleSubmit(updateTechRecord: Function) {
    this.handleFormState();
    this.isInvalid ? updateTechRecord(false) : updateTechRecord(true)
  }

  handleFormState() {
    const form = this.dynamicForm.sections.map(section => section.form)
    this.isDirty = this.isAnyFormDirty(form);
    this.isInvalid = this.isAnyFormInvalid(form);
  }

  isAnyFormDirty(forms: Array<CustomFormGroup | CustomFormArray>) {
    return forms.some(form => form.dirty);
  }

  isAnyFormInvalid(forms: Array<CustomFormGroup | CustomFormArray>) {
    const errors: GlobalError[] = [];
    forms.forEach(form => {
      DynamicFormService.updateValidity(form, errors);
    });

    errors.length > 0 ? this.errorService.setErrors(errors) : this.errorService.clearErrors();

    return forms.some(form => form.invalid);
  }
}
