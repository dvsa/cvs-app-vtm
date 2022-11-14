import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormArray, CustomFormGroup } from '@forms/services/dynamic-form.types';
import { Roles } from '@models/roles.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { ReasonForEditing, StatusCodes, TechRecordModel, VehicleTechRecordModel, VehicleTypes, Vrm } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { createProvisionalTechRecord, updateTechRecords } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Observable, tap } from 'rxjs';
import { TechRecordSummaryComponent } from '../tech-record-summary/tech-record-summary.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vehicle-technical-record',
  templateUrl: './vehicle-technical-record.component.html'
})
export class VehicleTechnicalRecordComponent implements OnInit, AfterViewInit {
  @ViewChild(TechRecordSummaryComponent) summary!: TechRecordSummaryComponent;
  @Input() vehicleTechRecord?: VehicleTechRecordModel;

  currentTechRecord$!: Observable<TechRecordModel | undefined>;
  records$: Observable<TestResultModel[]>;

  isDirty = false;
  isCurrent = false;
  isInvalid = false;
  isEditing = false;
  editingReason?: ReasonForEditing;

  constructor(
    testRecordService: TestRecordsService,
    private errorService: GlobalErrorService,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService,
    private activatedRoute: ActivatedRoute
  ) {
    this.records$ = testRecordService.testRecords$;
    this.isEditing = this.activatedRoute.snapshot.data['isEditing'] ?? false;
    this.editingReason = this.activatedRoute.snapshot.data['reason'];
  }

  ngOnInit(): void {
    this.currentTechRecord$ = this.technicalRecordService
      .viewableTechRecord$(this.vehicleTechRecord!)
      .pipe(tap(viewableTechRecord => (this.isCurrent = viewableTechRecord?.statusCode === StatusCodes.CURRENT)));
  }

  ngAfterViewInit(): void {
    this.handleFormState();
  }

  get currentVrm(): string | undefined {
    return this.vehicleTechRecord?.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
  }

  get otherVrms(): Vrm[] | undefined {
    return this.vehicleTechRecord?.vrms.filter(vrm => vrm.isPrimary === false);
  }

  get roles(): typeof Roles {
    return Roles;
  }

  get vehicleTypes(): typeof VehicleTypes {
    return VehicleTypes;
  }

  get statusCodes(): typeof StatusCodes {
    return StatusCodes;
  }

  get customSectionForms(): Array<CustomFormGroup | CustomFormArray> {
    const customSections = [
      this.summary.body.form,
      this.summary.dimensions.form,
      this.summary.tyres.form,
      this.summary.weights.form
    ];

    const type = this.vehicleTechRecord?.techRecord.find(record => record.statusCode === StatusCodes.CURRENT)?.vehicleType;

    if (type === VehicleTypes.PSV) {
      customSections.push(this.summary.psvBrakes!.form);
    } else if (type === VehicleTypes.TRL) {
      customSections.push(this.summary.trlBrakes!.form);
    }

    return customSections;
  }

  isAnyFormInvalid(forms: Array<CustomFormGroup | CustomFormArray>) {
    const errors: GlobalError[] = [];

    forms.forEach(form => DynamicFormService.updateValidity(form, errors));

    errors.length ? this.errorService.setErrors(errors) : this.errorService.clearErrors();

    return forms.some(form => form.invalid);
  }

  handleFormState() {
    if (this.isEditing) {
      const form = this.summary.sections.map(section => section.form).concat(this.customSectionForms);

      this.isDirty = form.some(form => form.dirty);
      this.isInvalid = this.isAnyFormInvalid(form);
    }
  }

  handleSubmit() {
    this.handleFormState();

    if (!this.isInvalid) {
      const { systemNumber } = this.vehicleTechRecord!;
      const hasProvisional = this.vehicleTechRecord!.techRecord.some(record => record.statusCode === StatusCodes.PROVISIONAL);

      if (this.editingReason == ReasonForEditing.CORRECTING_AN_ERROR) {
        this.store.dispatch(updateTechRecords({ systemNumber }));
      } else if (this.editingReason == ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED) {
        hasProvisional
          ? this.store.dispatch(updateTechRecords({ systemNumber, recordToArchiveStatus: StatusCodes.PROVISIONAL, newStatus: StatusCodes.PROVISIONAL }))
          : this.store.dispatch(createProvisionalTechRecord({ systemNumber }));
      }
    }
  }
}
