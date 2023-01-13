import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Roles } from '@models/roles.enum';
import { TechRecordActions } from '@models/tech-record/tech-record-actions.enum';
import { VehicleTechRecordModel, TechRecordModel, Vrm, VehicleTypes, StatusCodes } from '@models/vehicle-tech-record.model';
import { Store, select } from '@ngrx/store';
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

  constructor(private route: ActivatedRoute, private router: Router, private technicalRecordService: TechnicalRecordService, private store: Store) {}

  ngOnInit(): void {
    this.queryableRecordActions = this.recordActions.split(',');

    this.currentTechRecord$ = this.technicalRecordService.viewableTechRecord$(this.vehicleTechRecord!);

    this.currentTechRecord$
      .pipe(take(1))
      .subscribe(
        data =>
          (this.vehicleMakeAndModel =
            data?.vehicleType === this.vehicleTypes.PSV ? `${data.chassisMake} ${data.chassisModel}` : `${data?.make} ${data?.model}`)
      );
  }

  get currentVrm(): string | undefined {
    return this.vehicleTechRecord?.vrms.find(vrm => vrm.isPrimary === true)?.vrm;
  }

  get editableTechRecord$() {
    return this.store.pipe(select(editableTechRecord));
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

  navigateTo(path: string, queryParams?: Params): void {
    this.router.navigate([path], { relativeTo: this.route, queryParams });
  }
}
