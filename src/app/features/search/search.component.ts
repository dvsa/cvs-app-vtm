import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalError } from '@core/components/global-error/global-error.interface';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { SEARCH_TYPES } from '@services/technical-record/technical-record.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent {
  missingTermErrorMessage = 'You must provide a vehicle registration mark, trailer ID or vehicle identification number.';
  missingTypeErrorMessage = 'You must select a valid search criteria';

  constructor(public globalErrorService: GlobalErrorService, private router: Router) {}

  navigateSearch(term: string, type: string): void {
    this.globalErrorService.clearError();
    term = term.trim();

    if (!term) {
      this.globalErrorService.addError({ error: this.missingTermErrorMessage, anchorLink: 'search-term' });
    } else if (!Object.values(SEARCH_TYPES).includes(type as SEARCH_TYPES)) {
      this.globalErrorService.addError({ error: this.missingTypeErrorMessage, anchorLink: 'search-type' });
    } else {
      this.router.navigate(['/search/results'], { queryParams: { [type]: term } });
    }
  }

  getInlineErrorMessage(name: string): Observable<boolean> {
    return this.globalErrorService.errors$.pipe(map(errors => errors.some(error => error.anchorLink === name)));
  }

  getErrorByName(errors: GlobalError[], name: string): GlobalError | undefined {
    return errors.find(error => error.anchorLink === name);
  }
}
