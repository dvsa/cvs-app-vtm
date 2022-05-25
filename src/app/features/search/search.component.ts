import { Component, OnDestroy } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { VehicleTechRecordModel } from '../../models/vehicle-tech-record.model';
import { GlobalErrorService } from '../global-error/global-error.service';
import { select, Store } from '@ngrx/store';
import { selectQueryParams } from '@store/router/selectors/router.selectors';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy {
  vehicleTechRecords$: Observable<Array<VehicleTechRecordModel>>;
  ngDestroy$ = new Subject();
  searchErrorMessage = 'You must provide a vehicle registration mark, trailer ID or vehicle identification number.';


  constructor(private technicalRecordService: TechnicalRecordService, public globalErrorService: GlobalErrorService, 
    private store: Store, private router: Router) {
      this.store.pipe(select(selectQueryParams)).pipe(takeUntil(this.ngDestroy$)).subscribe((params) => {
        let vin = params['vin'];
        this.searchTechRecords(vin)
      });
    this.vehicleTechRecords$ = this.technicalRecordService.vehicleTechRecords$;
  }

  public searchTechRecords(searchTerm: string) {
    this.globalErrorService.clearError();

    searchTerm = searchTerm.trim();

    if (searchTerm) {
      this.technicalRecordService.searchBy({ type: 'vin', searchTerm });
    } else {
      this.globalErrorService.addError({ error: this.searchErrorMessage, anchorLink: 'search-term' });
    }
  }

  public getInlineErrorMessage(): Observable<number> {
    return this.globalErrorService.errors$.pipe(map((errors) => errors.length));
  }

  public navigateSearch(search: string): void {
    if (search) {
      const extras: NavigationExtras = {
        queryParams: {
            vin: search,
        }
      };
      this.router.navigate(['/search'], extras);
    } else {
      this.globalErrorService.clearError();
      this.globalErrorService.addError({ error: this.searchErrorMessage, anchorLink: 'search-term' });
    }
  }

  ngOnDestroy(){
    this.ngDestroy$.next(true);
    this.ngDestroy$.complete();
  }
}
