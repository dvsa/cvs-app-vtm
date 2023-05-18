import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlatesInner } from '@api/vehicle';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CustomFormControl, FormNodeTypes, FormNodeWidth, FormNodeOption } from '@forms/services/dynamic-form.types';
import { TechRecordModel } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { UserService } from '@services/user-service/user-service';
import { generatePlateSuccess, generatePlate, editableTechRecord } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Observable, map, take, tap } from 'rxjs';

@Component({
  selector: 'app-generate-plate',
  templateUrl: './tech-record-generate-plate.component.html',
  styleUrls: ['./tech-record-generate-plate.component.scss']
})
export class GeneratePlateComponent implements OnInit {
  form = new FormGroup({
    reason: new CustomFormControl({ name: 'reason', label: 'Reason for generating plate', type: FormNodeTypes.CONTROL }, '', [Validators.required])
  });

  emailAddress$: Observable<string | undefined>;

  constructor(
    private actions$: Actions,
    private globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    public userService: UserService
  ) {
    this.emailAddress$ = this.store.select(editableTechRecord).pipe(
      tap(record => {
        if (record?.vehicleType !== 'hgv' && record?.vehicleType !== 'trl') this.navigateBack();
      }),
      map(record => record?.applicantDetails?.emailAddress)
    );
  }

  ngOnInit(): void {
    this.actions$.pipe(ofType(generatePlateSuccess), take(1)).subscribe(() => {
      this.navigateBack();
    });
  }

  get width(): FormNodeWidth {
    return FormNodeWidth.L;
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

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit(): void {
    this.globalErrorService.clearErrors();
    if (!this.form.value.reason) {
      return this.globalErrorService.addError({ error: 'Reason for generating plate is required', anchorLink: 'reason' });
    }

    this.store.dispatch(generatePlate({ reason: this.form.value.reason }));
  }
}
