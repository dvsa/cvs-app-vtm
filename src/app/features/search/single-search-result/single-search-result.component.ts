import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormNode } from '@forms/services/dynamic-form.types';
import { createSingleSearchResult } from '@forms/templates/search/single-search-result.template';
import { Roles } from '@models/roles.enum';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

@Component({
  selector: 'app-single-search-result[vehicleTechRecord]',
  templateUrl: './single-search-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleSearchResultComponent implements OnInit {
  @Input() vehicleTechRecord!: VehicleTechRecordModel;
  vehicleDisplayData?: VehicleDisplayData;
  template?: FormNode;

  ngOnInit(): void {
    const record = TechnicalRecordService.filterTechRecordByStatusCode(this.vehicleTechRecord);

    this.vehicleDisplayData = {
      vin: this.vehicleTechRecord.vin,
      vrm: this.vehicleTechRecord.vrms.find(vrm => vrm.isPrimary)?.vrm,
      trailerId: this.vehicleTechRecord.trailerId,
      make: record?.vehicleType == 'psv' ? record?.chassisMake : record?.make,
      model: record?.vehicleType == 'psv' ? record?.chassisModel : record?.model,
      manufactureYear: record?.manufactureYear,
      vehicleType: record?.vehicleType.toUpperCase()
    };

    this.template = createSingleSearchResult(this.vehicleTechRecord.systemNumber);
  }

  public get roles() {
    return Roles;
  }
}

interface VehicleDisplayData {
  vin?: string;
  vrm?: string;
  trailerId?: string;
  make?: string;
  model?: string;
  manufactureYear?: number;
  vehicleType?: string;
}
