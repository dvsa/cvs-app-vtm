import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { SEARCH_TYPES } from '@services/technical-record/technical-record.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent {
  searchErrorMessage = 'You must provide a vehicle registration mark, trailer ID or vehicle identification number.';
  missingCriteriaErrorMessage = 'You must select a valid search criteria';

  constructor(public globalErrorService: GlobalErrorService, private router: Router) {}

  public navigateSearch(term: string, type: string): void {
    this.globalErrorService.clearError();

    term = term.trim();

    let extras: NavigationExtras;
    if (term) {
      switch (type) {
        case SEARCH_TYPES.VIN:
          extras = { queryParams: { vin: term } };
          break;
        case SEARCH_TYPES.PARTIAL_VIN:
          extras = { queryParams: { partialVin: term } };
          break;
        default:
          this.globalErrorService.addError({ error: this.missingCriteriaErrorMessage, anchorLink: 'search-type' });
          return;
      }

      this.router.navigate(['/search/results'], extras);
    } else {
      this.globalErrorService.addError({ error: this.searchErrorMessage, anchorLink: 'search-term' });
    }
  }

  getInlineErrorMessage(name: string): Observable<boolean> {
    return this.globalErrorService.errors$.pipe(map((errors) => errors.some((error) => error.anchorLink === name)));
  }

  getErrorByName(errors: GlobalError[], name: string): GlobalError | undefined {
    return errors.find((error) => error.anchorLink === name);
  }
}
