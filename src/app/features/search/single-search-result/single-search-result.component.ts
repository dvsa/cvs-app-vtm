import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormNode } from '@forms/services/dynamic-form.types';
import { createSingleSearchResult } from '@forms/templates/search/single-search-result.template';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-single-search-result[vehicleTechRecord]',
  templateUrl: './single-search-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleSearchResultComponent implements OnInit {
  @Input() vehicleTechRecord!: VehicleTechRecordModel;
  vehicleDisplayData?: vehicleDisplayData;
  template?: FormNode;
  ngDestroy$ = new Subject();

  constructor(private technicalRecordService: TechnicalRecordService) {}

  ngOnInit(): void {
    this.technicalRecordService.viewableTechRecord$(this.vehicleTechRecord, this.ngDestroy$)
      .subscribe(record => this.vehicleDisplayData = {
        vin: this.vehicleTechRecord.vin,
        vrm: this.vehicleTechRecord.vrms.find(vrm => vrm.isPrimary)?.vrm,
        make: record?.chassisMake,
        model: record?.chassisModel,
        manufactureYear: record?.manufactureYear,
        vehicleType: record?.vehicleType.toUpperCase()
      });

    this.template = createSingleSearchResult(this.vehicleTechRecord.vin);
  }
}

interface vehicleDisplayData {
  vin?: string;
  vrm?: string;
  make?: string;
  model?: string;
  manufactureYear?: number;
  vehicleType?: string;
}
