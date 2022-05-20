import { Component } from '@angular/core';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { map, Observable } from 'rxjs';
import { VehicleTechRecordModel } from '../../models/vehicle-tech-record.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  vehicleTechRecords$: Observable<Array<VehicleTechRecordModel>>;

  constructor(private technicalRecordService: TechnicalRecordService, public globalErrorService: GlobalErrorService) {
    this.vehicleTechRecords$ = this.technicalRecordService.vehicleTechRecords$;
  }

  public searchTechRecords(searchTerm: string) {
    const searchErrorMessage = 'You must provide a vehicle registration mark, trailer ID or vehicle identification number.';
    this.globalErrorService.clearError();

    searchTerm = searchTerm.trim();

    if (searchTerm) {
      this.technicalRecordService.searchBy({ type: 'vin', searchTerm });
    } else {
      this.globalErrorService.addError({ error: searchErrorMessage, anchorLink: 'search-term' });
    }
  }

  public getInlineErrorMessage(): Observable<number> {
    return this.globalErrorService.errors$.pipe(map((errors) => errors.length));
  }
}
