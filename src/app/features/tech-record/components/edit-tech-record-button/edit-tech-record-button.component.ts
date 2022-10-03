import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { createProvisionalTechRecordSuccess, updateEditingTechRecordCancel, updateTechRecordsSuccess } from '@store/technical-records';
import { ofType, Actions } from '@ngrx/effects';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';

@Component({
  selector: 'app-edit-tech-record-button',
  templateUrl: './edit-tech-record-button.component.html',
  styleUrls: ['./edit-tech-record-button.component.scss']
})
export class EditTechRecordButtonComponent implements OnInit {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  @Input() viewableTechRecord?: TechRecordModel;
  @Input() editableState = false;
  @Input() isDirty: boolean = false;

  @Output() editableStateChange = new EventEmitter<boolean>();
  @Output() submitCheckFormValidity = new EventEmitter();

  constructor(private actions$: Actions, private errorService: GlobalErrorService, private router: Router, private store: Store) {}

  ngOnInit() {
    this.actions$
      .pipe(ofType(updateTechRecordsSuccess, createProvisionalTechRecordSuccess), take(1))
      .subscribe(action =>
        this.router.navigateByUrl(
          `/tech-records/${action.vehicleTechRecords[0].systemNumber}/historic/${this.getLatestRecordTimestamp(action.vehicleTechRecords[0])}`
        )
      );
  }

  get isArchived(): boolean {
    return this.viewableTechRecord?.statusCode === StatusCodes.ARCHIVED;
  }

  getLatestRecordTimestamp(record: VehicleTechRecordModel): number {
    return Math.max(...record.techRecord.map(record => new Date(record.createdAt).getTime()));
  }

  toggleEditMode() {
    this.editableState = !this.editableState;
    this.editableStateChange.emit(this.editableState);
  }

  cancelAmend() {
    if (!this.isDirty || confirm('Your changes will not be saved. Are you sure?')) {
      this.toggleEditMode();
    }

    this.errorService.clearErrors();
    this.store.dispatch(updateEditingTechRecordCancel());
  }

  submitTechRecord() {
    this.submitCheckFormValidity.emit();

    this.toggleEditMode();
  }
}
