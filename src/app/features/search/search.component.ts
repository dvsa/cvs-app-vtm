import { Component } from '@angular/core';
import { TechRecord } from '@models/tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { Observable } from 'rxjs';
import { VehicleTechRecordModel } from '../../models/vehicle-tech-record.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchError: string | undefined;
  vehicleTechRecords: Observable<Array<VehicleTechRecordModel>>;
  techRecords?: Array<TechRecord>;

  constructor(private technicalRecordService: TechnicalRecordService) {
    this.vehicleTechRecords = this.technicalRecordService.vehicleTechRecords;
  }

  public searchTechRecords(searchTerm: string) {
    this.searchError = undefined;
    if (searchTerm) {
      this.technicalRecordService.searchBy({ type: 'vin', searchTerm });
    }
  }
}
