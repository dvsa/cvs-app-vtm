import { ViewportScroller } from '@angular/common';
import {
  Component, EventEmitter, Input, OnDestroy, Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { clearAllSectionStates, clearScrollPosition, updateEditingTechRecordCancel } from '@store/technical-records';
import {
  Observable, Subject, distinctUntilChanged, map, takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-edit-tech-record-button',
  templateUrl: './edit-tech-record-button.component.html',
})
export class EditTechRecordButtonComponent implements OnDestroy {
  @Input() isEditing = false;
  @Input() isDirty = false;
  @Input() customId = '';

  @Output() isEditingChange = new EventEmitter<boolean>();
  @Output() submitChange = new EventEmitter();
  destroy$ = new Subject();

  constructor(
    private errorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private technicalRecordService: TechnicalRecordService,
    private viewportScroller: ViewportScroller,
    private routerService: RouterService,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  get isArchived$(): Observable<boolean> {
    return this.technicalRecordService.techRecord$.pipe(
      map(
        (techRecord) => !(techRecord?.techRecord_statusCode === StatusCodes.CURRENT || techRecord?.techRecord_statusCode === StatusCodes.PROVISIONAL),
      ),
    );
  }

  checkIfEditableReasonRequired() {
    this.technicalRecordService.techRecord$
      .pipe(
        map((techRecord) => techRecord?.techRecord_statusCode),
        takeUntil(this.destroy$),
        distinctUntilChanged(),
      )
      .subscribe((statusCode) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
    // eslint-disable-next-line no-restricted-globals
    if (!this.isDirty || confirm('Your changes will not be saved. Are you sure?')) {
      this.toggleEditMode();
      this.errorService.clearErrors();
      this.store.dispatch(updateEditingTechRecordCancel());
      this.store.dispatch(clearAllSectionStates());
      this.store.dispatch(clearScrollPosition());

      void this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  submit() {
    this.submitChange.emit();
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
