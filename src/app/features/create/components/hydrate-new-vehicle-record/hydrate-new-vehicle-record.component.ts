import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { FormNode } from '@forms/services/dynamic-form.types';
import { vehicleTemplateMap } from '@forms/utils/tech-record-constants';
import { TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { updateEditingTechRecord } from '@store/technical-records/actions/technical-record-service.actions';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-hydrate-new-vehicle-record',
  templateUrl: './hydrate-new-vehicle-record.component.html',
  styleUrls: ['./hydrate-new-vehicle-record.component.scss']
})
export class HydrateNewVehicleRecordComponent implements OnInit, OnChanges {
  vehicleRecord!: VehicleTechRecordModel;
  middleIndex = 0;

  constructor(
    private globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {
    this.technicalRecordService.editableVehicleTechRecord$.pipe(take(1)).subscribe(data => (this.vehicleRecord = data!));
  }

  ngOnInit(): void {
    this.middleIndex = Math.floor(this.templates.length / 2);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  get templates(): Array<FormNode> {
    return vehicleTemplateMap.get(this.techRecord.vehicleType)!;
  }

  get techRecord(): TechRecordModel {
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
    console.log(this.vehicleRecord);
    console.log(this.techRecord);

    // dispatch
    // route to confirmation page
  }
}
