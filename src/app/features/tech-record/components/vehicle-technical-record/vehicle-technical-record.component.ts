import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Roles } from '@models/roles.enum';
import { TechRecordActions } from '@models/tech-record/tech-record-actions.enum';
import { TestResultModel } from '@models/test-results/test-result.model';
import { ReasonForEditing, StatusCodes, TechRecordModel, VehicleTechRecordModel, VehicleTypes, Vrm } from '@models/vehicle-tech-record.model';
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
  @Input() vehicle!: VehicleTechRecordModel;

  currentTechRecord$!: Observable<TechRecordModel | undefined>;
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
  }

  ngOnInit(): void {
    this.currentTechRecord$ = this.technicalRecordService.viewableTechRecord$(this.vehicle).pipe(
      tap(viewableTechRecord => {
        this.isCurrent = viewableTechRecord?.statusCode === StatusCodes.CURRENT;
        this.isArchived = viewableTechRecord?.statusCode === StatusCodes.ARCHIVED;
      })
    );
  }

  get currentVrm(): string | undefined {
    return this.vehicle.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
  }

  get otherVrms(): Vrm[] | undefined {
    return this.vehicle.vrms.filter(vrm => vrm.isPrimary === false);
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

  getActions(techRecord?: TechRecordModel): TechRecordActions {
    switch (techRecord?.statusCode) {
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

  createTest(techRecord?: TechRecordModel): void {
    if (techRecord?.hiddenInVta) {
      alert('Vehicle record is hidden in VTA.\n\nShow the vehicle record in VTA to start recording tests against it.');
    } else if (techRecord?.recordCompleteness === 'complete' || techRecord?.recordCompleteness === 'testable') {
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

    if (!this.isInvalid) {
      const { systemNumber } = this.vehicle;
      const hasProvisional = this.vehicle.techRecord.some(record => record.statusCode === StatusCodes.PROVISIONAL);

      if (this.editingReason == ReasonForEditing.CORRECTING_AN_ERROR) {
        this.store.dispatch(updateTechRecords({ systemNumber }));
      } else if (this.editingReason == ReasonForEditing.NOTIFIABLE_ALTERATION_NEEDED) {
        hasProvisional
          ? this.store.dispatch(
              updateTechRecords({ systemNumber, recordToArchiveStatus: StatusCodes.PROVISIONAL, newStatus: StatusCodes.PROVISIONAL })
            )
          : this.store.dispatch(createProvisionalTechRecord({ systemNumber }));
      }
    }
  }
}
