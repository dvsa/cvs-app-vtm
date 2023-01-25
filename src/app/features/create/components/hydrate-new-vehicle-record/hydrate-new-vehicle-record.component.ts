import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { FormNode } from '@forms/services/dynamic-form.types';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import { TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { UserServiceState } from '@store/user/user-service.reducer';
import { take } from 'rxjs';

@Component({
  selector: 'app-hydrate-new-vehicle-record',
  templateUrl: './hydrate-new-vehicle-record.component.html'
})
export class HydrateNewVehicleRecordComponent implements OnInit {
  vehicleRecord!: VehicleTechRecordModel;
  user?: UserServiceState;

  constructor(
    private globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private technicalRecordService: TechnicalRecordService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.technicalRecordService.editableVehicleTechRecord$.pipe(take(1)).subscribe(data => (this.vehicleRecord = data!));
    this.userService.user$.pipe(take(1)).subscribe(data => (this.user = data));
  }

  get templates(): Array<FormNode> {
    return vehicleTemplateMap.get(this.techRecord.vehicleType)!;
  }

  get techRecord(): TechRecordModel {
    if (!this.vehicleRecord) {
      this.router.navigate(['..'], { relativeTo: this.route });
    }
    return this.vehicleRecord!.techRecord[0];
  }

  get vrmOrTrailerId(): string {
    return this.techRecord.vehicleType === VehicleTypes.TRL ? `${this.vehicleRecord.trailerId}` : `${this.vehicleRecord.vrms[0].vrm}`;
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }
  handleSubmit() {
    this.technicalRecordService.editableVehicleTechRecord$.pipe(take(1)).subscribe(vehicleRecord =>
      this.technicalRecordService
        .postNewVehicleRecord(vehicleRecord as VehicleTechRecordModel, { id: this.user!.oid, name: this.user!.name })
        .pipe(take(1))
        .subscribe()
    );

    // route to confirmation page?
  }
}
