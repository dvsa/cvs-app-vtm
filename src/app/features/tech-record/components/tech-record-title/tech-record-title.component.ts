import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Roles } from '@models/roles.enum';
import { TechRecordActions } from '@models/tech-record/tech-record-actions.enum';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel, VehicleTypes, Vrm } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-tech-record-title',
  templateUrl: './tech-record-title.component.html',
  styleUrls: ['./tech-record-title.component.scss']
})
export class TechRecordTitleComponent implements OnInit {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  @Input() recordActions: TechRecordActions = TechRecordActions.NONE;
  @Input() hideActions: boolean = false;

  queryableRecordActions: string[] = [];
  currentTechRecord$!: Observable<TechRecordModel | undefined>;

  constructor(private router: Router, private technicalRecordService: TechnicalRecordService) {}

  ngOnInit(): void {
    this.queryableRecordActions = this.recordActions.split(',');

    this.currentTechRecord$ = this.technicalRecordService.viewableTechRecord$(this.vehicleTechRecord!);
  }

  get currentVrm(): string | undefined {
    return this.vehicleTechRecord?.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
  }

  get vehicleType(): string {
    return this.vehicleTechRecord?.techRecord[0].vehicleType!;
  }

  get otherVrms(): Vrm[] | undefined {
    return this.vehicleTechRecord?.vrms.filter(vrm => vrm.isPrimary === false);
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

  getCompletenessColor(completeness?: string): 'green' | 'red' {
    return completeness === 'complete' ? 'green' : 'red';
  }

  navigateToPromotion(): void {
    this.router.navigateByUrl(`/tech-records/${this.vehicleTechRecord?.systemNumber}/provisional/promote`);
  }

  navigateToArchive(): void {
    this.currentTechRecord$
      .pipe(take(1))
      .subscribe(techRecord =>
        techRecord?.statusCode === StatusCodes.PROVISIONAL
          ? this.router.navigateByUrl(`/tech-records/${this.vehicleTechRecord?.systemNumber}/provisional/archive`)
          : this.router.navigateByUrl(`/tech-records/${this.vehicleTechRecord?.systemNumber}/archive`)
      );
  }

  navigateToChangeVisibility(): void {
    this.currentTechRecord$
      .pipe(take(1))
      .subscribe(techRecord =>
        techRecord?.statusCode === StatusCodes.PROVISIONAL
          ? this.router.navigateByUrl(`/tech-records/${this.vehicleTechRecord?.systemNumber}/provisional/change-vta-visibility`)
          : this.router.navigateByUrl(`/tech-records/${this.vehicleTechRecord?.systemNumber}/change-vta-visibility`)
      );
  }
  navigateToChangeVehicleType() {
    this.currentTechRecord$
      .pipe(take(1))
      .subscribe(techRecord =>
        techRecord?.statusCode === StatusCodes.PROVISIONAL
          ? this.router.navigateByUrl(`/tech-records/${this.vehicleTechRecord?.systemNumber}/provisional/change-vehicle-type`)
          : this.router.navigateByUrl(`/tech-records/${this.vehicleTechRecord?.systemNumber}/change-vehicle-type`)
      );
  }
}
