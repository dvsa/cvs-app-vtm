import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StatusCode, VehicleType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/lgv/skeleton';
import { Roles } from '@models/roles.enum';
import { TechRecordActions } from '@models/tech-record/tech-record-actions.enum';
import { StatusCodes, TechRecordModel, V3TechRecordModel, VehicleTechRecordModel, VehicleTypes, Vrm } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { selectTechRecord } from '@store/technical-records';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-tech-record-title[vehicle]',
  templateUrl: './tech-record-title.component.html',
  styleUrls: ['./tech-record-title.component.scss']
})
export class TechRecordTitleComponent implements OnInit {
  @Input() vehicle?: V3TechRecordModel;
  @Input() actions: TechRecordActions = TechRecordActions.NONE;
  @Input() hideActions: boolean = false;
  @Input() customTitle = '';

  currentVehicleTechRecord$?: Observable<V3TechRecordModel | undefined>;
  currentTechRecord$?: Observable<V3TechRecordModel | undefined>;
  queryableActions: string[] = [];
  vehicleMakeAndModel = '';

  constructor(private route: ActivatedRoute, private router: Router, private store: Store, private technicalRecordService: TechnicalRecordService) {}

  ngOnInit(): void {
    this.queryableActions = this.actions.split(',');

    this.currentVehicleTechRecord$ = this.store.select(selectTechRecord);

    // On create new vehicle, when vehicleTechRecords is empty use the editableTechRecord
    this.currentTechRecord$ = this.currentVehicleTechRecord$;

    this.currentTechRecord$
      .pipe(take(1))
      .subscribe(
        data =>
          (this.vehicleMakeAndModel =
            (data as any)?.make || (data as any)?.techRecord_chassisMake
              ? (data as any).techRecord_vehicleType === this.vehicleTypes.PSV
                ? `${(data as any).techRecord_chassisMake} ${(data as any).techRecord_chassisModel ?? ''}`
                : `${(data as any)?.techRecord_make} ${(data as any)?.techRecord_model ?? ''}`
              : '')
      );
  }

  get currentVrm(): string | undefined {
    return this.vehicle?.primaryVrm;
  }

  get otherVrms(): string[] | undefined {
    return this.vehicle?.secondaryVrms;
  }

  get vehicleTypes(): typeof VehicleTypes {
    return VehicleTypes;
  }

  get roles(): typeof Roles {
    return Roles;
  }

  get statuses(): typeof StatusCodes {
    return StatusCodes;
  }

  getVehicleType(techRecord: V3TechRecordModel): VehicleTypes {
    return this.technicalRecordService.getVehicleTypeWithSmallTrl(techRecord);
  }

  getCompletenessColor(completeness?: string): 'green' | 'red' {
    return completeness === 'complete' ? 'green' : 'red';
  }

  isVrmEditable(statusCode: StatusCode | undefined, currentVehicleType: VehicleType, editableVehicleType: VehicleType): boolean {
    return !this.hideActions && statusCode !== StatusCodes.ARCHIVED && currentVehicleType === editableVehicleType;
  }

  navigateTo(path: string, queryParams?: Params): void {
    this.router.navigate([path], { relativeTo: this.route, queryParams });
  }
}
