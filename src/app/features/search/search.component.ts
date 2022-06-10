import { Component, OnDestroy } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
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

  constructor(private technicalRecordService: TechnicalRecordService, public globalErrorService: GlobalErrorService, private store: Store, private router: Router) {
    this.store.pipe(select(selectQueryParams), takeUntil(this.ngDestroy$)).subscribe((params) => {
      let searchTerm = params['term'];

      if (searchTerm) {
        this.searchTechRecords(searchTerm, params['type']);
      }
    });

    this.vehicleTechRecords$ = this.technicalRecordService.vehicleTechRecords$;
  }

  public searchTechRecords(searchTerm: string, type: SEARCH_TYPES) {
    this.globalErrorService.clearError();

    searchTerm = searchTerm.trim();

    if (searchTerm) {
<<<<<<< HEAD
      searchTerm = searchTerm.trim();
      this.technicalRecordService.searchBy({ type: SEARCH_TYPES.VIN, searchTerm });
=======
      // TODO: Switch to this after CB2-4185 has been integrated.
      // this.technicalRecordService.searchBy({ type, searchTerm });
      this.technicalRecordService.searchBy({ type: 'vin', searchTerm });
>>>>>>> feat(cb2-4184): create a ui selector for search criteria
    } else {
      this.globalErrorService.addError({ error: this.searchErrorMessage, anchorLink: 'search-term' });
    }
  }

  public getInlineErrorMessage(): Observable<number> {
    return this.globalErrorService.errors$.pipe(map((errors) => errors.length));
  }

  public navigateSearch(term: string, type: string): void {
    if (term) {
      const extras: NavigationExtras = { queryParams: { term, type } };
      this.router.navigate(['/search'], extras);
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
