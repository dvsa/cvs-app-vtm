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

  get otherVrms(): Vrm[] | undefined {
    return this.vehicleTechRecord?.vrms.filter(vrm => vrm.isPrimary === false);
  }

  get vehicleTypes(): typeof VehicleTypes {
    return VehicleTypes;
  }

  get roles(): typeof Roles {
    return Roles;
  }

  getCompletenessColor(completeness?: string): 'green' | 'red' {
    return completeness === 'complete' ? 'green' : 'red';
  }

  getCompletenessText(completeness?: string): string {
    return `${completeness === 'complete' ? '' : 'NOT '}READY FOR TEST`;
  }

  navigateToPromotion(): void {
    this.router.navigateByUrl(`/tech-records/${this.vehicleTechRecord?.systemNumber}/provisional/promote`);
  }

  navigateToArchive(): void {
    this.currentTechRecord$.pipe(take(1)).subscribe(data => {
      return data?.statusCode === StatusCodes.PROVISIONAL
        ? this.router.navigateByUrl(`/tech-records/${this.vehicleTechRecord?.systemNumber}/provisional/archive`)
        : this.router.navigateByUrl(`/tech-records/${this.vehicleTechRecord?.systemNumber}/archive`);
    });
  }
}
