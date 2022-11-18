import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TechRecordModel, VehicleTechRecordModel, VehicleTypes, Vrm } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tech-record-title',
  templateUrl: './tech-record-title.component.html'
})
export class TechRecordTitleComponent implements OnInit {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  @Input() includeButtons: boolean = false;

  currentTechRecord$!: Observable<TechRecordModel | undefined>;

  constructor(private router: Router, private technicalRecordService: TechnicalRecordService) { }

  ngOnInit(): void {
    if (this.vehicleTechRecord) {
      this.currentTechRecord$ = this.technicalRecordService.viewableTechRecord$(this.vehicleTechRecord);
    }
  }

  get currentVrm(): string | undefined {
    return this.vehicleTechRecord?.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
  }

  get otherVrms(): Vrm[] | undefined {
    return this.vehicleTechRecord?.vrms.filter(vrm => vrm.isPrimary === false);
  }

  get vehicleTypes(): typeof VehicleTypes {
    return VehicleTypes;
  }

  navigateToPromotion(): void {
    this.router.navigateByUrl(`/tech-records/${this.vehicleTechRecord?.systemNumber}/${this.vehicleTechRecord?.vin}/provisional/promote`);
  }
}
