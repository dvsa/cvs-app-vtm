import { KeyValue } from '@angular/common';
import {
  AfterContentInit,
  Component, inject, OnDestroy, OnInit,
} from '@angular/core';
import { FormArray, NgControl } from '@angular/forms';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { BaseControlComponent } from '@forms/components/base-control/base-control.component';
import { CustomControl, CustomFormControl } from '@forms/services/dynamic-form.types';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-adr-examiner-notes-history',
  templateUrl: './adr-examiner-notes-history-edit.component.html',
  styleUrls: ['adr-examiner-notes-history.component-edit.scss'],
})
export class AdrExaminerNotesHistoryEditComponent extends BaseControlComponent implements OnInit, OnDestroy, AfterContentInit {

  destroy$ = new ReplaySubject<boolean>(1);

  formArray = new FormArray<CustomFormControl>([]);
  currentTechRecord?: TechRecordType<'hgv'> | TechRecordType<'lgv'> | TechRecordType<'trl'> = undefined;
  technicalRecordService = inject(TechnicalRecordService);

  ngOnInit() {
    this.formArray.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((changes) => {
      this.control?.patchValue(changes, { emitModelToViewChange: true });
    });
    this.technicalRecordService.techRecord$.pipe(takeUntil(this.destroy$)).subscribe((currentTechRecord) => {
      this.currentTechRecord = currentTechRecord as TechRecordType<'hgv'> | TechRecordType<'lgv'> | TechRecordType<'trl'>;
    });
  }

  override ngAfterContentInit() {
    const injectedControl = this.injector.get(NgControl, null);
    if (injectedControl) {
      const ngControl = injectedControl.control as unknown as KeyValue<string, CustomControl>;
      if (ngControl.value) {
        this.name = ngControl.key;
        this.control = ngControl.value;
      }
    }
  }

  getAdditionalExaminerNotes() {
    const returnValue = this.currentTechRecord ? this.currentTechRecord.techRecord_adrDetails_additionalExaminerNotes ?? [] : [];
    return returnValue;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
