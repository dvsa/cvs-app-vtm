import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Roles } from '@models/roles.enum';
import { TechRecordActions } from '@models/tech-record/tech-record-actions.enum';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel, VehicleTypes, Vrm } from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { editableTechRecord } from '@store/technical-records';
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
  vehicleMakeAndModel: string = '';
  vrms: Vrm[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private technicalRecordService: TechnicalRecordService, private store: Store) {}

  ngOnInit(): void {
    this.queryableRecordActions = this.recordActions.split(',');

    this.currentTechRecord$ = this.technicalRecordService.viewableTechRecord$(this.vehicleTechRecord!);

    this.currentTechRecord$.pipe(take(1)).subscribe(data => {
      this.vehicleMakeAndModel =
        data?.vehicleType === this.vehicleTypes.PSV ? `${data.chassisMake} ${data.chassisModel}` : `${data?.make} ${data?.model}`;
      this.vrms = this.mapVrms(data!) ?? this.vehicleTechRecord!.vrms;
    });
  }

  get currentVrm(): string | undefined {
    return this.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
  }

  get editableTechRecord$() {
    return this.store.pipe(select(editableTechRecord));
  }

  get otherVrms(): Vrm[] | undefined {
    return this.vrms.filter(vrm => vrm.isPrimary === false);
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

  mapVrms(techRecord: TechRecordModel) {
    let mappedVrms: Vrm[] = [];
    if (techRecord.historicPrimaryVrm) mappedVrms.push({ vrm: techRecord.historicPrimaryVrm, isPrimary: true });
    if (techRecord.historicSecondaryVrms) techRecord.historicSecondaryVrms.forEach(vrm => mappedVrms.push({ vrm: vrm, isPrimary: false }));
    return mappedVrms.length > 0 ? mappedVrms : undefined;
  }

  getCompletenessColor(completeness?: string): 'green' | 'red' {
    return completeness === 'complete' ? 'green' : 'red';
  }

  navigateTo(path: string, queryParams?: Params): void {
    this.router.navigate([path], { relativeTo: this.route, queryParams });
  }
}
