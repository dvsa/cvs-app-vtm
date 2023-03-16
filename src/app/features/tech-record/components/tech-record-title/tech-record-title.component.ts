import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Roles } from '@models/roles.enum';
import { TechRecordActions } from '@models/tech-record/tech-record-actions.enum';
import { EuVehicleCategories, StatusCodes, TechRecordModel, VehicleTechRecordModel, VehicleTypes, Vrm } from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { editableTechRecord } from '@store/technical-records';
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

  currentTechRecord$!: Observable<TechRecordModel | undefined>;
  queryableActions: string[] = [];
  vehicleMakeAndModel = '';

  constructor(private route: ActivatedRoute, private router: Router, private store: Store, private technicalRecordService: TechnicalRecordService) {}

  ngOnInit(): void {
    this.queryableActions = this.actions.split(',');

    this.currentTechRecord$ = this.technicalRecordService.viewableTechRecord$(this.vehicle!);

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

  get editableTechRecord$() {
    return this.store.pipe(select(editableTechRecord));
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
    return techRecord.vehicleType === VehicleTypes.TRL && techRecord.euVehicleCategory === EuVehicleCategories.O1
      ? VehicleTypes.SMALL_TRL
      : techRecord.vehicleType;
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
