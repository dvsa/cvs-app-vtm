import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Roles } from '@models/roles.enum';
import { TechRecordActions } from '@models/tech-record/tech-record-actions.enum';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel, VehicleTypes, Vrm } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-tech-record-title[vehicle]',
  templateUrl: './tech-record-title.component.html',
  styleUrls: ['./tech-record-title.component.scss']
})
export class TechRecordTitleComponent implements OnInit {
  @Input() vehicle?: VehicleTechRecordModel;
  @Input() actions: TechRecordActions = TechRecordActions.NONE;
  @Input() hideActions: boolean = false;
  @Input() customTitle = '';

  currentVehicleTechRecord$?: Observable<TechRecordModel | undefined>;
  currentTechRecord$?: Observable<TechRecordModel | undefined>;
  queryableActions: string[] = [];
  vehicleMakeAndModel = '';

  constructor(private route: ActivatedRoute, private router: Router, private store: Store, private technicalRecordService: TechnicalRecordService) {}

  ngOnInit(): void {
    this.queryableActions = this.actions.split(',');

    this.currentVehicleTechRecord$ = this.technicalRecordService.viewableTechRecord$;

    // On create new vehicle, when vehicleTechRecords is empty use the editableTechRecord
    this.currentTechRecord$ = this.currentVehicleTechRecord$;

    this.currentTechRecord$
      .pipe(take(1))
      .subscribe(
        data =>
          (this.vehicleMakeAndModel =
            data?.make || data?.chassisMake
              ? data.vehicleType === this.vehicleTypes.PSV
                ? `${data.chassisMake} ${data.chassisModel ?? ''}`
                : `${data?.make} ${data?.model ?? ''}`
              : '')
      );
  }

  get currentVrm(): string | undefined {
    return this.vehicle?.vrms?.find(vrm => vrm.isPrimary)?.vrm;
  }

  get otherVrms(): Vrm[] | undefined {
    return this.vehicle?.vrms?.filter(vrm => !vrm.isPrimary);
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

  getVehicleType(techRecord: TechRecordModel): VehicleTypes {
    return this.technicalRecordService.getVehicleTypeWithSmallTrl(techRecord);
  }

  getCompletenessColor(completeness?: string): 'green' | 'red' {
    return completeness === 'complete' ? 'green' : 'red';
  }

  isVrmEditable(statusCode: StatusCodes | undefined, currentVehicleType: VehicleTypes, editableVehicleType: VehicleTypes): boolean {
    return !this.hideActions && statusCode !== StatusCodes.ARCHIVED && currentVehicleType === editableVehicleType;
  }

  navigateTo(path: string, queryParams?: Params): void {
    this.router.navigate([path], { relativeTo: this.route, queryParams });
  }
}
