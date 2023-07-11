import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormNode } from '@forms/services/dynamic-form.types';
import { createSingleSearchResult } from '@forms/templates/search/single-search-result.template';
import { Roles } from '@models/roles.enum';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { SearchResult } from '@store/tech-record-search/reducer/tech-record-search.reducer';

@Component({
  selector: 'app-single-search-result[searchResult]',
  templateUrl: './single-search-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleSearchResultComponent implements OnInit {
  @Input() searchResult!: SearchResult;
  vehicleDisplayData?: VehicleDisplayData;
  template?: FormNode;

  ngOnInit(): void {
    this.vehicleDisplayData = {
      vin: this.searchResult.vin,
      vrm: this.searchResult.primaryVrm,
      trailerId: this.searchResult.trailerId,
      make: this.searchResult.techRecord_vehicleType == 'psv' ? this.searchResult.techRecord_chassisMake : this.searchResult.techRecord_make,
      model: this.searchResult.techRecord_vehicleType == 'psv' ? this.searchResult.techRecord_chassisModel : this.searchResult.techRecord_model,
      manufactureYear: this.searchResult.techRecord_manufactureYear,
      vehicleType: this.searchResult.techRecord_vehicleType.toUpperCase()
    };

    this.template = createSingleSearchResult(this.searchResult.systemNumber);
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
  manufactureYear?: number | null;
  vehicleType?: string;
}
