import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { VehicleTechRecordModel } from '../../models/vehicle-tech-record.model';
import { GlobalErrorService } from '../global-error/global-error.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  vehicleTechRecords$: Observable<Array<VehicleTechRecordModel>>;
  searchedValue!: string;

  constructor(private technicalRecordService: TechnicalRecordService, public globalErrorService: GlobalErrorService, private route: ActivatedRoute) {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      let vin = params.get('vin');
      if (vin !== null) {
        if (vin === 'undefined'){
          vin = ''
        }
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
