import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { PlatesInner } from '@api/vehicle';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import {
  CustomFormControl, FormNodeOption, FormNodeTypes, FormNodeWidth,
} from '@forms/services/dynamic-form.types';
import { Actions, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { State } from '@store/index';
import {
  cannotGeneratePlate, generatePlate, generatePlateSuccess, getCanGeneratePlate,
} from '@store/technical-records';
import {
  Observable, map, take, tap,
} from 'rxjs';

@Component({
  selector: 'app-generate-plate',
  templateUrl: './tech-record-generate-plate.component.html',
  styleUrls: ['./tech-record-generate-plate.component.scss'],
})
export class GeneratePlateComponent implements OnInit {
  form = new FormGroup({
    reason: new CustomFormControl({ name: 'reason', label: 'Reason for generating plate', type: FormNodeTypes.CONTROL }, '', [Validators.required]),
  });

  emailAddress$?: Observable<string | undefined | null>;

  constructor(
    private actions$: Actions,
    private globalErrorService: GlobalErrorService,
    private store: Store<State>,
    public userService: UserService,
    private technicalRecordService: TechnicalRecordService,
    public routerService: RouterService,
  ) {}

  ngOnInit(): void {
    this.actions$.pipe(ofType(generatePlateSuccess), take(1)).subscribe(() => {
      this.routerService.navigateBack();
    });
    this.store.pipe(select(getCanGeneratePlate), take(1)).subscribe((canGeneratePlate) => {
      if (!canGeneratePlate) {
        this.routerService.navigateBack();
      }
    });
    this.emailAddress$ = this.technicalRecordService.techRecord$.pipe(
      tap((record) => {
        if (record?.techRecord_vehicleType !== 'hgv' && record?.techRecord_vehicleType !== 'trl') {
          this.routerService.navigateBack();
        }
      }),
      map((record) => {
        if (record?.techRecord_vehicleType !== 'hgv' && record?.techRecord_vehicleType !== 'trl') {
          return undefined;
        }
        return record?.techRecord_applicantDetails_emailAddress;
      }),
    );
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
      { label: 'Manual', value: PlatesInner.PlateReasonForIssueEnum.Manual },
    ];
  }

  handleSubmit(): void {
    this.globalErrorService.clearErrors();
    if (!this.form.value.reason) {
      return this.globalErrorService.addError({ error: 'Reason for generating plate is required', anchorLink: 'reason' });
    }
    this.store.dispatch(generatePlate({ reason: this.form.value.reason }));
    this.store.dispatch(cannotGeneratePlate());
  }
}
