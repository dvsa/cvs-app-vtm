import { KeyValue, ViewportScroller } from '@angular/common';
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
import { updateScrollPosition } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { ReasonForEditing } from '@models/vehicle-tech-record.model';

@Component({
  selector: 'app-adr-examiner-notes-history',
  templateUrl: './adr-examiner-notes-history-edit.component.html',
  styleUrls: ['adr-examiner-notes-history.component-edit.scss'],
})
export class AdrExaminerNotesHistoryEditComponent extends BaseControlComponent implements OnInit, OnDestroy, AfterContentInit {

  destroy$ = new ReplaySubject<boolean>(1);

  formArray = new FormArray<CustomFormControl>([]);
  currentTechRecord?: TechRecordType<'hgv' | 'lgv' | 'trl'> = undefined;
  technicalRecordService = inject(TechnicalRecordService);
  store = inject(Store<TechnicalRecordServiceState>);
  viewportScroller = inject(ViewportScroller);
  router = inject(Router);
  route = inject(ActivatedRoute);
  editingReason?: ReasonForEditing;

  ngOnInit() {
    this.formArray.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((changes) => {
      this.control?.patchValue(changes, { emitModelToViewChange: true });
    });
    this.technicalRecordService.techRecord$.pipe(takeUntil(this.destroy$)).subscribe((currentTechRecord) => {
      this.currentTechRecord = currentTechRecord as TechRecordType<'hgv' | 'lgv' | 'trl'>;
    });
    this.editingReason = this.route.snapshot.data['reason'];
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

  getEditAdditionalExaminerNotePage(examinerNoteIndex: number) {
    const route = this.editingReason ? `../${this.editingReason}/edit-additional-examiner-note/${examinerNoteIndex}` : `./tyre-search/${examinerNoteIndex}`;

    this.store.dispatch(updateScrollPosition({ position: this.viewportScroller.getScrollPosition() }));

    void this.router.navigate([route], { relativeTo: this.route, state: this.currentTechRecord });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
