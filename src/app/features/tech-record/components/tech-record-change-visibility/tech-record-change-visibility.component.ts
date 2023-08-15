import { Component, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { CustomFormControl, CustomFormGroup, FormNodeTypes } from '@forms/services/dynamic-form.types';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/index';
import { techRecord, updateTechRecord, updateTechRecordSuccess } from '@store/technical-records';
import cloneDeep from 'lodash.clonedeep';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tech-record-change-visibility',
  templateUrl: './tech-record-change-visibility.component.html',
  styleUrls: ['./tech-record-change-visibility.component.scss']
})
export class TechRecordChangeVisibilityComponent implements OnInit, OnDestroy {
  techRecord?: V3TechRecordModel;

  form: CustomFormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private actions$: Actions,
    private errorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<State>,
    private technicalRecordService: TechnicalRecordService
  ) {
    this.form = new CustomFormGroup(
      { name: 'reasonForChangingVisibility', type: FormNodeTypes.GROUP },
      { reason: new CustomFormControl({ name: 'reason', type: FormNodeTypes.CONTROL }, undefined, [Validators.required]) }
    );
    this.actions$
      .pipe(ofType(updateTechRecordSuccess), takeUntil(this.destroy$))
      .subscribe(({ vehicleTechRecord }) =>
        this.router.navigate([`/tech-records/${vehicleTechRecord.systemNumber}/${vehicleTechRecord.createdTimestamp}`])
      );
  }

  get title(): string {
    return `${this.techRecord?.techRecord_hiddenInVta ? 'Show' : 'Hide'} record in VTA`;
  }

  get buttonLabel(): string {
    return `${this.techRecord?.techRecord_hiddenInVta ? 'Show' : 'Hide'} record`;
  }

  ngOnInit(): void {
    this.store
      .select(techRecord)
      .pipe(take(1))
      .subscribe(record => {
        this.techRecord = record;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(): void {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  handleSubmit(form: { reason: string }): void {
    this.form.valid
      ? this.errorService.clearErrors()
      : this.errorService.setErrors([
          {
            error: `Reason for ${this.techRecord?.techRecord_hiddenInVta ? 'showing' : 'hiding'} is required`,
            anchorLink: 'reasonForChangingVisibility'
          }
        ]);

    if (!this.form.valid || !form.reason) {
      return;
    }

    const updatedTechRecord: V3TechRecordModel = {
      ...cloneDeep(this.techRecord!),
      techRecord_reasonForCreation: form.reason,
      techRecord_hiddenInVta: !this.techRecord?.techRecord_hiddenInVta
    };

    this.technicalRecordService.updateEditingTechRecord(updatedTechRecord);

    this.store.dispatch(updateTechRecord({ vehicleTechRecord: updatedTechRecord }));
  }
}
