import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { addError, clearError } from '@store/global-error/actions/global-error.actions';
import { Observable } from 'rxjs';
import { VehicleTechRecordModel } from '../../models/vehicle-tech-record.model';
import { GlobalErrorService } from '../global-error/global-error.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchError: string | undefined;
  vehicleTechRecords$: Observable<Array<VehicleTechRecordModel>>;

  constructor(private technicalRecordService: TechnicalRecordService, private globalErrorService: GlobalErrorService) {
    this.vehicleTechRecords$ = this.technicalRecordService.vehicleTechRecords;
  }

  public searchTechRecords(searchTerm: string) {
    const searchErrorMessage = 'You must provide a vehicle registration mark, trailer ID or vehicle identification number.';
      this.globalErrorService.clearError()
      this.searchError = undefined;

    searchTerm = searchTerm.trim();

    if (searchTerm) {
      this.technicalRecordService.searchBy({ type: 'vin', searchTerm });
    } else {
      this.searchError = searchErrorMessage;
      this.globalErrorService.addError({ error: searchErrorMessage, anchorLink: 'search-term' });
    }
  }
}
