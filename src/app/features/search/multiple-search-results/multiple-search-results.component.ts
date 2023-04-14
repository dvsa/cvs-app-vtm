import { Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { select, Store } from '@ngrx/store';
import { selectQueryParams } from '@store/router/selectors/router.selectors';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Roles } from '@models/roles.enum';
import { SEARCH_TYPES, TechnicalRecordHttpService } from '@services/technical-record-http/technical-record-http.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

@Component({
  selector: 'app-multiple-search-results',
  templateUrl: './multiple-search-results.component.html',
  styleUrls: ['multiple-search-results.component.scss']
})
export class MultipleSearchResultsComponent implements OnDestroy {
  vehicleTechRecords$: Observable<VehicleTechRecordModel[]>;
  ngDestroy$ = new Subject();

  constructor(
    public globalErrorService: GlobalErrorService,
    private technicalRecordService: TechnicalRecordService,
    private technicalRecordHttpService: TechnicalRecordHttpService,
    private store: Store,
    private location: Location
  ) {
    this.store.pipe(select(selectQueryParams), takeUntil(this.ngDestroy$)).subscribe(params => {
      if (Object.keys(params).length === 1) {
        const type = Object.keys(params)[0] as SEARCH_TYPES;
        const searchTerm = params[type] as string;

        if (searchTerm && Object.values(SEARCH_TYPES).includes(type)) {
          this.globalErrorService.clearErrors();
          this.technicalRecordHttpService.searchBy(type, searchTerm);
        }
      }
    });

    this.vehicleTechRecords$ = this.technicalRecordService.vehicleTechRecords$;
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.location.back();
  }

  ngOnDestroy() {
    this.ngDestroy$.next(true);
    this.ngDestroy$.complete();
  }

  public get Roles() {
    return Roles;
  }
}
