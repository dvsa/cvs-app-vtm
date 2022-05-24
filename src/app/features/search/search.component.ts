import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { map, Observable } from 'rxjs';
import { VehicleTechRecordModel } from '../../models/vehicle-tech-record.model';
import { GlobalErrorService } from '../global-error/global-error.service';
import { select, Store } from '@ngrx/store';
import { selectQueryParams } from '@store/router/selectors/router.selectors';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  vehicleTechRecords$: Observable<Array<VehicleTechRecordModel>>;

  constructor(private technicalRecordService: TechnicalRecordService, public globalErrorService: GlobalErrorService, 
    private store: Store, private router: Router) {
      this.store.pipe(select(selectQueryParams)).subscribe((params) => {
        let vin = params['vin'];
        if (vin !== null || vin !== undefined) {
          this.searchTechRecords(vin)
        }
      });
    this.vehicleTechRecords$ = this.technicalRecordService.vehicleTechRecords$;
  }

  public searchTechRecords(searchTerm: string) {
    const searchErrorMessage = 'You must provide a vehicle registration mark, trailer ID or vehicle identification number.';
    this.globalErrorService.clearError();

    searchTerm = searchTerm.trim();

    if (searchTerm || searchTerm !== '') {
      this.technicalRecordService.searchBy({ type: 'vin', searchTerm });
    } else {
      this.globalErrorService.addError({ error: searchErrorMessage, anchorLink: 'search-term' });
    }
  }

  public getInlineErrorMessage(): Observable<number> {
    return this.globalErrorService.errors$.pipe(map((errors) => errors.length));
  }

  public navigateSearch(search: string): void {
    const extras: NavigationExtras = {
      queryParams: {
          vin: search,
      }
    };
    this.router.navigate(['/search'], extras);
  }
}
