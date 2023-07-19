import { ViewportScroller } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import {
  clearAllSectionStates,
  createProvisionalTechRecordSuccess,
  updateEditingTechRecordCancel,
  updateTechRecordsSuccess
} from '@store/technical-records';
import { Observable, Subject, map, takeUntil, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-edit-tech-record-button',
  templateUrl: './edit-tech-record-button.component.html'
})
export class EditTechRecordButtonComponent implements OnInit, OnDestroy {
  @Input() isEditing = false;
  @Input() isDirty = false;

  @Output() isEditingChange = new EventEmitter<boolean>();
  @Output() submitChange = new EventEmitter();
  destroy$ = new Subject();

  constructor(
    private actions$: Actions,
    private errorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private technicalRecordService: TechnicalRecordService,
    private viewportScroller: ViewportScroller,
    private routerService: RouterService
  ) {}

  ngOnInit() {
    this.actions$
      .pipe(
        ofType(updateTechRecordsSuccess, createProvisionalTechRecordSuccess),
        withLatestFrom(this.routerService.getRouteNestedParam$('systemNumber'), this.technicalRecordService.viewableTechRecord$),
        takeUntil(this.destroy$)
      )
      .subscribe(([, systemNumber, techRecord]) => {
        const routeSuffix = techRecord?.statusCode === StatusCodes.CURRENT ? '' : '/provisional';
        this.router.navigateByUrl(`/tech-records/${systemNumber}${routeSuffix}`);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  get isArchived$(): Observable<boolean> {
    return this.technicalRecordService.viewableTechRecord$.pipe(
      map(techRecord => !(techRecord?.statusCode === StatusCodes.CURRENT || techRecord?.statusCode === StatusCodes.PROVISIONAL))
    );
  }

  checkIfEditableReasonRequired() {
    this.technicalRecordService.viewableTechRecord$
      .pipe(
        map(techRecord => techRecord?.statusCode),
        takeUntil(this.destroy$)
      )
      .subscribe(statusCode => {
        statusCode !== StatusCodes.PROVISIONAL
          ? this.router.navigate(['amend-reason'], { relativeTo: this.route })
          : this.router.navigate(['notifiable-alteration-needed'], { relativeTo: this.route });
      });
    this.technicalRecordService.clearReasonForCreation();
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing;
    this.isEditingChange.emit(this.isEditing);
  }

  cancel() {
    if (!this.isDirty || confirm('Your changes will not be saved. Are you sure?')) {
      this.toggleEditMode();
      this.errorService.clearErrors();
      this.store.dispatch(updateEditingTechRecordCancel());
      this.store.dispatch(clearAllSectionStates());
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  submit() {
    this.submitChange.emit();
    this.viewportScroller.scrollToPosition([0, 0]);
    this.store.dispatch(clearAllSectionStates());
  }
}
