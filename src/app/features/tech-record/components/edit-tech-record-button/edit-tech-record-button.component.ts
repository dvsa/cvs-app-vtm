import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import {
  createProvisionalTechRecordSuccess,
  selectVehicleTechnicalRecordsBySystemNumber,
  updateEditingTechRecordCancel,
  updateTechRecordsSuccess
} from '@store/technical-records';
import { ofType, Actions } from '@ngrx/effects';
import { map, mergeMap, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { ViewportScroller } from '@angular/common';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import cloneDeep from 'lodash.clonedeep';
import { updateEditingTechRecord } from '@store/technical-records';

@Component({
  selector: 'app-edit-tech-record-button',
  templateUrl: './edit-tech-record-button.component.html',
  styleUrls: ['./edit-tech-record-button.component.scss']
})
export class EditTechRecordButtonComponent implements OnInit {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  @Input() viewableTechRecord?: TechRecordModel;
  @Input() isEditing = false;
  @Input() isDirty = false;

  @Output() isEditingChange = new EventEmitter<boolean>();
  @Output() submitChange = new EventEmitter();

  constructor(
    private actions$: Actions,
    private errorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private technicalRecordService: TechnicalRecordService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    this.actions$
      .pipe(
        ofType(updateTechRecordsSuccess, createProvisionalTechRecordSuccess),
        mergeMap(_action => this.store.select(selectVehicleTechnicalRecordsBySystemNumber)),
        take(1)
      )
      .subscribe(vehicleTechRecord => {
        const techRecord = vehicleTechRecord!.techRecord[0];

        const routeSuffix = techRecord.statusCode === StatusCodes.CURRENT ? '' : '/provisional';

        this.router.navigateByUrl(`/tech-records/${vehicleTechRecord!.systemNumber}${routeSuffix}`);
      });
  }

  get isArchived(): boolean {
    return !(this.viewableTechRecord?.statusCode === StatusCodes.CURRENT || this.viewableTechRecord?.statusCode === StatusCodes.PROVISIONAL);
  }

  getLatestRecordTimestamp(record: VehicleTechRecordModel): number {
    return Math.max(...record.techRecord.map(record => new Date(record.createdAt).getTime()));
  }

  checkIfEditableReasonRequired() {
    this.viewableTechRecord?.statusCode !== StatusCodes.PROVISIONAL
      ? this.router.navigate(['amend-reason'], { relativeTo: this.route })
      : this.router.navigate(['notifiable-alteration-needed'], { relativeTo: this.route });
    this.clearReasonForCreation();
  }

  clearReasonForCreation(): void {
    this.technicalRecordService.editableVehicleTechRecord$
      .pipe(
        map(data => data ?? { ...cloneDeep(this.vehicleTechRecord!) }),
        take(1)
      )
      .subscribe(data => {
        this.store.dispatch(updateEditingTechRecord(data));
      });
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
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  submit() {
    this.submitChange.emit();
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
