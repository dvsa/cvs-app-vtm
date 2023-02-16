import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, FormNodeOption, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { LETTER_TYPES } from '@forms/templates/general/letter-types';
import { approvalType, LettersIntoAuthApprovalType, LettersOfAuth, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { generateLetter, generateLetterSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import cloneDeep from 'lodash.clonedeep';
import { take } from 'rxjs';

@Component({
  selector: 'app-generate-letter',
  templateUrl: './tech-record-generate-letter.component.html',
  styleUrls: ['./tech-record-generate-letter.component.scss']
})
export class GenerateLetterComponent {
  vehicle?: VehicleTechRecordModel;
  currentTechRecord?: TechRecordModel;
  form = new FormGroup({
    letterType: new CustomFormControl({ name: 'letterType', label: 'Type of letter to generate', type: FormNodeTypes.CONTROL }, '', [
      Validators.required
    ])
  });
  width: FormNodeWidth = FormNodeWidth.L;

  paragraphMap = new Map<approvalType, number>([
    [approvalType.GB_WVTA, 6],
    [approvalType.UKNI_WVTA, 3],
    [approvalType.EU_WVTA_PRE_23, 3],
    [approvalType.EU_WVTA_23_ON, 7],
    [approvalType.QNIG, 3],
    [approvalType.PROV_GB_WVTA, 3],
    [approvalType.SMALL_SERIES, 3],
    [approvalType.IVA_VCA, 3],
    [approvalType.IVA_DVSA_NI, 3]
  ]);

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
      { label: 'Trailer authorised', value: LETTER_TYPES[0].value },
      { label: 'Trailer rejected', value: LETTER_TYPES[1].value }
    ];
  }

  get mostRecentLetter(): LettersOfAuth | undefined {
    return (
      this.currentTechRecord &&
      cloneDeep(this.currentTechRecord.lettersOfAuth)
        ?.sort((a, b) =>
          a.letterDateRequested && b.letterDateRequested ? new Date(a.letterDateRequested).getTime() - new Date(b.letterDateRequested).getTime() : 0
        )
        ?.pop()
    );
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit(): void {
    this.globalErrorService.clearErrors();
    if (this.form.value.letterType === '') {
      return this.globalErrorService.addError({ error: 'Letter type is required', anchorLink: 'letterType' });
    }
    if (!this.currentTechRecord) {
      return this.globalErrorService.addError({ error: 'Could not retrieve current technical record' });
    }

    const paragraphId = this.form.value.letterType == 'trailer authorisation' ? this.paragraphMap.get(this.currentTechRecord.approvalType!) : 4;

    this.actions$.pipe(ofType(generateLetterSuccess), take(1)).subscribe(() => this.navigateBack());

    this.store.dispatch(generateLetter({ letterType: this.form.value.letterType, paragraphId: paragraphId ?? 4 }));
  }
}
