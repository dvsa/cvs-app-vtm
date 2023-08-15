import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Roles } from '@models/roles.enum';
import { TechRecordActions } from '@models/tech-record/tech-record-actions.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { ReasonForEditing, StatusCodes, TechRecordModel, V3TechRecordModel, VehicleTypes, Vrm } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { editingTechRecord, updateTechRecord, updateTechRecordSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { TechRecordSummaryComponent } from '../tech-record-summary/tech-record-summary.component';

@Component({
  selector: 'app-vehicle-technical-record',
  templateUrl: './vehicle-technical-record.component.html',
  styleUrls: ['./vehicle-technical-record.component.scss']
})
export class VehicleTechnicalRecordComponent implements OnInit, OnDestroy {
  @ViewChild(TechRecordSummaryComponent) summary!: TechRecordSummaryComponent;
  @Input() techRecord?: V3TechRecordModel;

  testResults$: Observable<TestResultModel[]>;
  editingReason?: ReasonForEditing;
  recordHistory?: V3TechRecordModel[];
  hasAProvisional: Boolean = false;

  isCurrent = false;
  isArchived = false;
  isEditing = false;
  isDirty = false;
  isInvalid = false;

  destroy$ = new Subject();

  constructor(
    testRecordService: TestRecordsService,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService,
    private actions$: Actions
  ) {
    this.testResults$ = testRecordService.testRecords$;
    this.isEditing = this.activatedRoute.snapshot.data['isEditing'] ?? false;
    this.editingReason = this.activatedRoute.snapshot.data['reason'];
  }
  ngOnDestroy(): void {
    this.destroy$.next;
    this.destroy$.complete();
  }
  ngOnInit(): void {
    this.hasAProvisional = this.recordHistory?.some(record => record.techRecord_statusCode === StatusCodes.PROVISIONAL) ?? false;
    const isProvisionalUrl = this.router.url?.split('/').slice(-2)?.includes(StatusCodes.PROVISIONAL);

    this.actions$.pipe(ofType(updateTechRecordSuccess), takeUntil(this.destroy$)).subscribe(vehicleTechRecord => {
      this.router.navigate([
        `/tech-records/${vehicleTechRecord.vehicleTechRecord.systemNumber}/${vehicleTechRecord.vehicleTechRecord.createdTimestamp}`
      ]);
    });
    if (this.techRecord?.techRecord_statusCode === StatusCodes.ARCHIVED) {
      this.isArchived = true;
    } else if (this.techRecord?.techRecord_statusCode === StatusCodes.CURRENT) {
      this.isCurrent = true;
    }

    if (isProvisionalUrl && !this.hasAProvisional) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  get currentVrm(): string | undefined {
    return this.techRecord?.primaryVrm;
  }

  get otherVrms(): Vrm[] | undefined {
    return (this.techRecord as any).secondaryVrms;
  }

  get roles(): typeof Roles {
    return Roles;
  }

  get vehicleTypes(): typeof VehicleTypes {
    return VehicleTypes;
  }

  get statusCodes(): typeof StatusCodes {
    return StatusCodes;
  }

  hasPlates(techRecord: TechRecordModel) {
    return (techRecord.plates?.length ?? 0) > 0;
  }

  getActions(techRecord?: V3TechRecordModel): TechRecordActions {
    switch (techRecord?.techRecord_statusCode) {
      case StatusCodes.CURRENT:
        return TechRecordActions.CURRENT;
      case StatusCodes.PROVISIONAL:
        return TechRecordActions.PROVISIONAL;
      case StatusCodes.ARCHIVED:
      default:
        return TechRecordActions.NONE;
    }
  }

  getVehicleDescription(techRecord: TechRecordModel, vehicleType: VehicleTypes | undefined): string {
    switch (vehicleType) {
      case VehicleTypes.TRL:
        return techRecord.vehicleConfiguration ?? '';
      case VehicleTypes.PSV:
        return techRecord.bodyMake && techRecord.bodyModel ? `${techRecord.bodyMake}-${techRecord.bodyModel}` : '';
      case VehicleTypes.HGV:
        return techRecord.make && techRecord.model ? `${techRecord.make}-${techRecord.model}` : '';
      default:
        return 'Unknown Vehicle Type';
    }
  }

  showCreateTestButton(vehicleType: VehicleTypes | string): boolean {
    return (
      !this.isArchived &&
      !this.isEditing &&
      (this.isCurrent || vehicleType === VehicleTypes.TRL || vehicleType === VehicleTypes.HGV || vehicleType === VehicleTypes.PSV)
    );
  }

  createTest(techRecord?: V3TechRecordModel): void {
    if (techRecord?.techRecord_hiddenInVta) {
      alert('Vehicle record is hidden in VTA.\n\nShow the vehicle record in VTA to start recording tests against it.');
    } else if (techRecord?.techRecord_recordCompleteness === 'complete' || techRecord?.techRecord_recordCompleteness === 'testable') {
      this.router.navigate(['test-records/create-test/type'], { relativeTo: this.route });
    } else {
      alert(
        'Incomplete vehicle record.\n\n' +
          'This vehicle does not have enough data to be tested. ' +
          'Call Technical Support to correct this record and use SAR to test this vehicle.'
      );
    }
  }
  // TODO: V3 the update lambda should automatically create a provisional if the vehicle doesn't have one. It doesn't seem to be doing this at the moment
  handleSubmit(): void {
    this.summary.checkForms();
    if (!this.isInvalid) {
      this.store
        .select(editingTechRecord)
        .pipe(take(1))
        .subscribe(record => {
          if (record) {
            if (this.editingReason === ReasonForEditing.CORRECTING_AN_ERROR) {
              this.store.dispatch(updateTechRecord({ vehicleTechRecord: record }));
            } else if (this.editingReason === ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED) {
              this.hasAProvisional
                ? this.store.dispatch(updateTechRecord({ vehicleTechRecord: record }))
                : this.store.dispatch(updateTechRecord({ vehicleTechRecord: { ...record, techRecord_statusCode: StatusCodes.PROVISIONAL } }));
            }
          }
        });
    }
  }
}
