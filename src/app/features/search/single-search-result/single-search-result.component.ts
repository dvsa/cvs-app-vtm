import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormNode } from '@forms/services/dynamic-form.types';
import { createSingleSearchResult } from '@forms/templates/search/single-search-result.template';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { Subject, takeUntil } from 'rxjs';
import { Roles } from '@models/roles.enum';

@Component({
  selector: 'app-single-search-result[vehicleTechRecord]',
  templateUrl: './single-search-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleSearchResultComponent implements OnInit, OnDestroy {
  @Input() vehicleTechRecord!: VehicleTechRecordModel;
  vehicleDisplayData?: vehicleDisplayData;
  template?: FormNode;
  destroy$ = new Subject<void>();

  constructor(private technicalRecordService: TechnicalRecordService) {}

  ngOnInit(): void {
    this.technicalRecordService
      .viewableTechRecord$(this.vehicleTechRecord)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        record =>
          (this.vehicleDisplayData = {
            vin: this.vehicleTechRecord.vin,
            vrm: this.vehicleTechRecord.vrms.find(vrm => vrm.isPrimary)?.vrm,
            trailerId: this.vehicleTechRecord.trailerId,
            make: record?.chassisMake,
            model: record?.chassisModel,
            manufactureYear: record?.manufactureYear,
            vehicleType: record?.vehicleType.toUpperCase()
          })
      );

    this.template = createSingleSearchResult(this.vehicleTechRecord.systemNumber);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public get roles() {
    return Roles;
  }
}

interface vehicleDisplayData {
  vin?: string;
  vrm?: string;
  trailerId?: string;
  make?: string;
  model?: string;
  manufactureYear?: number;
  vehicleType?: string;
}
