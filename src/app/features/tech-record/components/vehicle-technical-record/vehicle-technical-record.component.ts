import { ViewportScroller } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { Roles } from '@models/roles.enum';
import { TechRecordActions } from '@models/tech-record/tech-record-actions.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { ReasonForEditing, StatusCodes, TechRecordModel, V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { RouterService } from '@services/router/router.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { UserService } from '@services/user-service/user-service';
import { clearAllSectionStates, clearScrollPosition, editingTechRecord, updateTechRecord, updateTechRecordSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Observable, Subject, take, takeUntil, withLatestFrom } from 'rxjs';
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
  recordHistory?: TechRecordSearchSchema[];

  isCurrent = false;
  isArchived = false;
  isEditing = false;
  isDirty = false;
  isInvalid = false;

  destroy$ = new Subject();
  hasTestResultAmend: boolean | undefined = false;

  constructor(
    public globalErrorService: GlobalErrorService,
    public userService: UserService,
    testRecordService: TestRecordsService,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService,
    private actions$: Actions,
    private viewportScroller: ViewportScroller,
    private routerService: RouterService
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
    this.actions$.pipe(ofType(updateTechRecordSuccess), takeUntil(this.destroy$)).subscribe(vehicleTechRecord => {
      this.router.navigate([
        `/tech-records/${vehicleTechRecord.vehicleTechRecord.systemNumber}/${vehicleTechRecord.vehicleTechRecord.createdTimestamp}`
      ]);
    });
    this.isArchived = this.techRecord?.techRecord_statusCode === StatusCodes.ARCHIVED;
    this.isCurrent = this.techRecord?.techRecord_statusCode === StatusCodes.CURRENT;

    this.userService.roles$.pipe(take(1)).subscribe(storedRoles => {
      this.hasTestResultAmend = storedRoles?.some(role => {
        return Roles.TestResultAmend.split(',').includes(role);
      });
    });
  }

  get currentVrm(): string | undefined {
    return this.techRecord?.techRecord_vehicleType !== 'trl' ? this.techRecord?.primaryVrm ?? '' : undefined;
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
        return TechRecordActions.ARCHIVED;
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
    this.store.dispatch(clearScrollPosition());
    if (
      (techRecord as TechRecordType<'get'>)?.techRecord_recordCompleteness === 'complete' ||
      (techRecord as TechRecordType<'get'>)?.techRecord_recordCompleteness === 'testable'
    ) {
      this.router.navigate(['test-records/create-test/type'], { relativeTo: this.route });
    } else {
      this.globalErrorService.setErrors([
        {
          error: this.getCreateTestErrorMessage(techRecord?.techRecord_hiddenInVta ?? false),
          anchorLink: 'create-test'
        }
      ]);

      this.viewportScroller.scrollToPosition([0, 0]);
    }
  }

  handleSubmit(): void {
    this.summary.checkForms();
    if (!this.isInvalid) {
      this.store
        .select(editingTechRecord)
        .pipe(
          take(1),
          withLatestFrom(this.routerService.getRouteNestedParam$('systemNumber'), this.routerService.getRouteNestedParam$('createdTimestamp'))
        )
        .subscribe(([record, systemNumber, createdTimestamp]) => {
          if (record && systemNumber && createdTimestamp) {
            this.store.dispatch(updateTechRecord({ systemNumber, createdTimestamp }));
            this.store.dispatch(clearAllSectionStates());
            this.store.dispatch(clearScrollPosition());
          }
        });
    }
  }

  private getCreateTestErrorMessage(hiddenInVta: boolean | undefined): string {
    if (hiddenInVta) {
      return 'Vehicle record is hidden in VTA. Show the vehicle record in VTA to start recording tests against it.';
    }

    return this.hasTestResultAmend
      ? 'This vehicle does not have enough information to be tested. Please complete this record so tests can be recorded against it.'
      : 'This vehicle does not have enough information to be tested. Call the Contact Centre to complete this record so tests can be recorded against it.';
  }
}
