import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormGroup, FormNode, FormNodeOption, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { generateLetter, generateLetterSuccess, generatePlate, generatePlateSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { take } from 'rxjs';
import { ValidatorNames } from '@forms/models/validators.enum';
import { Actions, ofType } from '@ngrx/effects';
import { Letters } from '@api/vehicle/model/letters';

@Component({
  selector: 'app-generate-letter',
  templateUrl: './tech-record-generate-letter.component.html',
  styleUrls: ['./tech-record-generate-letter.component.scss']
})
export class GenerateLetterComponent implements OnInit, OnChanges {
  reasons: Array<FormNodeOption<string>> = [
    { label: 'Authorised', value: Letters.LetterIssueTypeEnum.Authorised },
    { label: 'Rejected', value: Letters.LetterIssueTypeEnum.Rejected }
  ];

  vehicle?: VehicleTechRecordModel;
  currentTechRecord?: TechRecordModel;
  form: CustomFormGroup;
  width: FormNodeWidth = FormNodeWidth.L;

  template: FormNode = {
    name: 'criteria',
    type: FormNodeTypes.GROUP,
    children: [
      {
        name: 'letterType',
        label: 'Type of letter to generate',
        value: '',
        type: FormNodeTypes.CONTROL,
        validators: [{ name: ValidatorNames.Required }]
      }
    ]
  };

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

    this.form = this.dfs.createForm(this.template) as CustomFormGroup;
  }

  ngOnInit(): void {
    if (!this.currentTechRecord || this.currentTechRecord.vehicleType !== 'trl') {
      this.navigateBack();
    }

    this.actions$.pipe(ofType(generateLetterSuccess), take(1)).subscribe(() => {
      this.navigateBack();
    });
  }

  ngOnChanges(): void {
    this.globalErrorService.clearErrors();
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit(letterType: string): void {
    this.globalErrorService.clearErrors();
    if (letterType === '') {
      return this.globalErrorService.addError({ error: 'Letter type is required', anchorLink: 'letterType' });
    }

    this.store.dispatch(generateLetter({ techRecord: this.currentTechRecord!, letterType: letterType }));
  }
}
