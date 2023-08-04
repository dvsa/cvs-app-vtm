import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Roles } from '@models/roles.enum';
import { TechRecordActions } from '@models/tech-record/tech-record-actions.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import {
  ReasonForEditing,
  StatusCodes,
  TechRecordModel,
  V3TechRecordModel,
  VehicleTechRecordModel,
  VehicleTypes,
  Vrm
} from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { TestRecordsService } from '@services/test-records/test-records.service';
import { createProvisionalTechRecord, updateTechRecords } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Observable, tap } from 'rxjs';
import { TechRecordSummaryComponent } from '../tech-record-summary/tech-record-summary.component';

@Component({
  selector: 'app-vehicle-technical-record[vehicle]',
  templateUrl: './vehicle-technical-record.component.html',
  styleUrls: ['./vehicle-technical-record.component.scss']
})
export class VehicleTechnicalRecordComponent implements OnInit {
  @ViewChild(TechRecordSummaryComponent) summary!: TechRecordSummaryComponent;
  @Input() vehicle!: V3TechRecordModel;

  currentTechRecord$: Observable<V3TechRecordModel | undefined>;
  testResults$: Observable<TestResultModel[]>;
  editingReason?: ReasonForEditing;

  isCurrent = false;
  isArchived = false;
  isEditing = false;
  isDirty = false;
  isInvalid = false;

  constructor(
    testRecordService: TestRecordsService,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {
    this.testResults$ = testRecordService.testRecords$;
    this.isEditing = this.activatedRoute.snapshot.data['isEditing'] ?? false;
    this.editingReason = this.activatedRoute.snapshot.data['reason'];
    this.currentTechRecord$ = this.technicalRecordService.techRecord$.pipe(
      tap(viewableTechRecord => {
        this.isCurrent = viewableTechRecord?.techRecord_statusCode === StatusCodes.CURRENT;
        this.isArchived = viewableTechRecord?.techRecord_statusCode === StatusCodes.ARCHIVED;
      })
    );
  }

  ngOnInit(): void {
    console.log(this.vehicle);
    const hasProvisionalRecord = this.vehicle.techRecord_statusCode === StatusCodes.PROVISIONAL;
    const isProvisionalUrl = this.router.url?.split('/').slice(-2)?.includes(StatusCodes.PROVISIONAL);

    if (isProvisionalUrl && !hasProvisionalRecord) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }

  get currentVrm(): string | undefined {
    return this.vehicle.primaryVrm;
  }

  get otherVrms(): Vrm[] | undefined {
    return (this.vehicle as any).secondaryVrms;
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

  handleSubmit(): void {
    this.summary.checkForms();

    //1.check the form is valid
    //2.

    if (!this.isInvalid) {
      const { systemNumber } = this.vehicle;
      // TODO: figure out if the vehicle has a provisional record
      // const hasProvisional = this.vehicle.techRecord.some(record => record.statusCode === StatusCodes.PROVISIONAL);
      if (this.editingReason == ReasonForEditing.CORRECTING_AN_ERROR) {
        // this.store.dispatch(updateTechRecords());
      } else if (this.editingReason == ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED) {
        console.log(this.editingReason);
        // this.store.dispatch(updateTechRecords());
        // hasProvisional
        // ? this.store.dispatch(
        //     updateTechRecords({ systemNumber, recordToArchiveStatus: StatusCodes.PROVISIONAL, newStatus: StatusCodes.PROVISIONAL })
        //   )
        // : this.store.dispatch(createProvisionalTechRecord({ systemNumber }));
      }
    }
  }
}
