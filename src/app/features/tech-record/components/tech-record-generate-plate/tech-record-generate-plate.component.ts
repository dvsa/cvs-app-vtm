import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, CustomFormGroup, FormNode, FormNodeOption, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { generatePlate, generatePlateSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { take } from 'rxjs';
import { ValidatorNames } from '@forms/models/validators.enum';
import { Actions, ofType } from '@ngrx/effects';
import { PlatesInner } from '@api/vehicle';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-generate-plate',
  templateUrl: './tech-record-generate-plate.component.html',
  styleUrls: ['./tech-record-generate-plate.component.scss']
})
export class GeneratePlateComponent implements OnInit, OnChanges {
  vehicle?: VehicleTechRecordModel;
  currentTechRecord?: TechRecordModel;
  form = new FormGroup({
    letterType: new CustomFormControl({ name: 'plateReason', label: 'Reason for generating plate', type: FormNodeTypes.CONTROL }, '', [
      Validators.required
    ])
  });
  width: FormNodeWidth = FormNodeWidth.L;

  constructor(
    private actions$: Actions,
    public dfs: DynamicFormService,
    private globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {
    this.technicalRecordService.selectedVehicleTechRecord$.pipe(take(1)).subscribe(vehicle => (this.vehicle = vehicle));

    this.technicalRecordService.editableTechRecord$.pipe(take(1)).subscribe(techRecord => (this.currentTechRecord = techRecord));
  }

  get reasons(): Array<FormNodeOption<string>> {
    return [
      { label: 'Free replacement', value: PlatesInner.PlateReasonForIssueEnum.FreeReplacement },
      { label: 'Replacement', value: PlatesInner.PlateReasonForIssueEnum.Replacement },
      { label: 'Destroyed', value: PlatesInner.PlateReasonForIssueEnum.Destroyed },
      { label: 'Provisional', value: PlatesInner.PlateReasonForIssueEnum.Provisional },
      { label: 'Original', value: PlatesInner.PlateReasonForIssueEnum.Original },
      { label: 'Manual', value: PlatesInner.PlateReasonForIssueEnum.Manual }
    ];
  }

  ngOnInit(): void {
    if (!this.currentTechRecord || (this.currentTechRecord.vehicleType !== 'hgv' && this.currentTechRecord.vehicleType !== 'trl')) {
      this.navigateBack();
    }

    this.actions$.pipe(ofType(generatePlateSuccess), take(1)).subscribe(() => this.navigateBack());
  }

  ngOnChanges(): void {
    return;
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit(plateReasonForGenerating: string): void {
    this.globalErrorService.clearErrors();
    if (plateReasonForGenerating === '') {
      return this.globalErrorService.addError({ error: 'Reason for generating plate is required', anchorLink: 'plateReasonForGenerating' });
    }

    this.store.dispatch(generatePlate({ vehicleRecord: this.vehicle!, techRecord: this.currentTechRecord!, reason: plateReasonForGenerating }));
  }
}
