import { Component, OnDestroy } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { typeAnnotation } from '@babel/types';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import { SEARCH_TYPES, TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { selectQueryParams } from '@store/router/selectors/router.selectors';
import { map, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnDestroy {
  vehicleTechRecords$: Observable<Array<VehicleTechRecordModel>>;
  ngDestroy$ = new Subject();
  searchErrorMessage = 'You must provide a vehicle registration mark, trailer ID or vehicle identification number.';
  missingCriteriaErrorMessage = 'You must select a valid search criteria';

  constructor(private technicalRecordService: TechnicalRecordService, public globalErrorService: GlobalErrorService, private store: Store, private router: Router) {
    this.store.pipe(select(selectQueryParams), takeUntil(this.ngDestroy$)).subscribe((params) => {
      let type = Object.keys(params)[0];
      let searchTerm = params[type] as string;

      if (searchTerm && Object.values(SEARCH_TYPES).includes(type as SEARCH_TYPES) && Object.keys(params).length === 1) {
        this.searchTechRecords(searchTerm, type as SEARCH_TYPES);
      }
    });

    this.vehicleTechRecords$ = this.technicalRecordService.vehicleTechRecords$;
  }

  public searchTechRecords(searchTerm: string, type: SEARCH_TYPES) {
    this.globalErrorService.clearError();

    searchTerm = searchTerm.trim();

    if (searchTerm) {
      if(type) {
        this.technicalRecordService.searchBy({ type, searchTerm });
      }
      else {
        this.globalErrorService.addError({ error: this.missingCriteriaErrorMessage, anchorLink: 'search-term' });
      }
    } else {
      this.globalErrorService.addError({ error: this.searchErrorMessage, anchorLink: 'search-term' });
    }
  }

  public getInlineErrorMessage(): Observable<number> {
    return this.globalErrorService.errors$.pipe(map((errors) => errors.length));
  }

  public navigateSearch(term: string, type: string): void {
    let extras: NavigationExtras;
    if (term) {
      switch(type){
        case(SEARCH_TYPES.VIN):
          extras = { queryParams: { vin: term} };
          this.router.navigate(['/search'], extras);
          break;
        case(SEARCH_TYPES.PARTIAL_VIN):
          extras = { queryParams: { partialVin: term } };
          this.router.navigate(['/search'], extras);
          break;
        default:
          this.globalErrorService.clearError();
          this.globalErrorService.addError({ error: this.missingCriteriaErrorMessage, anchorLink: 'search-term' });
      }
    } else {
      this.globalErrorService.clearError();
      this.globalErrorService.addError({ error: this.searchErrorMessage, anchorLink: 'search-term' });
    }
  }

  ngOnDestroy() {
    this.ngDestroy$.next(true);
    this.ngDestroy$.complete();
  }
}
