import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StatusCode } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/lgv/skeleton';
import { VehicleType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { Roles } from '@models/roles.enum';
import { TechRecordActions } from '@models/tech-record/tech-record-actions.enum';
import { StatusCodes, V3TechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { selectTechRecord } from '@store/technical-records';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-tech-record-title[vehicle]',
  templateUrl: './tech-record-title.component.html',
  styleUrls: ['./tech-record-title.component.scss'],
})
export class TechRecordTitleComponent implements OnInit {
  @Input() vehicle?: V3TechRecordModel | any;
  @Input() actions: TechRecordActions = TechRecordActions.NONE;
  @Input() hideActions = false;
  @Input() customTitle = '';

  currentTechRecord$?: Observable<TechRecordType<'get'> | undefined>;
  queryableActions: string[] = [];
  vehicleMakeAndModel = '';

  constructor(private route: ActivatedRoute, private router: Router, private store: Store, private technicalRecordService: TechnicalRecordService) {}

  ngOnInit(): void {
    this.queryableActions = this.actions.split(',');

    this.currentTechRecord$ = this.store.select(selectTechRecord) as Observable<TechRecordType<'get'> | undefined>;

    this.currentTechRecord$.pipe(take(1)).subscribe((data) => {
      if (data) {
        this.vehicleMakeAndModel = this.technicalRecordService.getMakeAndModel(data);
      }
    });
  }

  get currentVrm(): string | undefined {
    return this.vehicle?.techRecord_vehicleType !== 'trl' ? this.vehicle?.primaryVrm ?? '' : undefined;
  }

  get otherVrms(): string[] | undefined {
    return this.vehicle?.techRecord_vehicleType !== 'trl' ? this.vehicle?.secondaryVrms ?? [] : undefined;
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
    void this.router.navigate([path], { relativeTo: this.route, queryParams });
  }
}
