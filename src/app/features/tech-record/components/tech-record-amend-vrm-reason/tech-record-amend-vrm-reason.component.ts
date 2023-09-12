import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { DynamicFormService } from '@forms/services/dynamic-form.service';
import { CustomFormControl, FormNodeOption, FormNodeTypes, FormNodeWidth } from '@forms/services/dynamic-form.types';
import { NotTrailer, StatusCodes, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { amendVrm, amendVrmSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-amend-vrm-reason',
  templateUrl: './tech-record-amend-vrm-reason.component.html',
  styleUrls: ['./tech-record-amend-vrm-reason.component.scss']
})
export class AmendVrmReasonComponent implements OnDestroy, OnInit {
  techRecord?: NotTrailer;
  makeAndModel?: string;

  form = new FormGroup({
    isCherishedTransfer: new CustomFormControl(
      { name: 'is-cherished-transfer', label: 'Why do you want to amend this VRM?', type: FormNodeTypes.CONTROL },
      '',
      [Validators.required]
    )
  });

  private destroy$ = new Subject<void>();

  constructor(
    private actions$: Actions,
    public dfs: DynamicFormService,
    private globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {}

  ngOnInit(): void {
    this.technicalRecordService.techRecord$.pipe(takeUntil(this.destroy$)).subscribe(record => {
      if (record?.techRecord_statusCode === 'archived' || !record) {
        return this.navigateBack();
      }
      this.techRecord = record as NotTrailer;
      this.makeAndModel = this.technicalRecordService.getMakeAndModel(record);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get reasons(): Array<FormNodeOption<boolean>> {
    return [
      { label: 'Cherished transfer', value: true, hint: 'Current VRM will be archived' },
      { label: 'Correcting an error', value: false, hint: 'Current VRM will not be archived' }
    ];
  }

  get width(): FormNodeWidth {
    return FormNodeWidth.L;
  }

  get vehicleType(): VehicleTypes | undefined {
    return this.techRecord ? this.technicalRecordService.getVehicleTypeWithSmallTrl(this.techRecord) : undefined;
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  submit(reason: string): void {
    this.router.navigate([reason], { relativeTo: this.route });
  }
}
