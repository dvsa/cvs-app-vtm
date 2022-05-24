import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SpinnerService } from 'src/app/layout/spinner/spinner.service';

@Component({
  selector: 'app-tech-record',
  templateUrl: './tech-record.component.html',
  styleUrls: ['./tech-record.component.scss']
})
export class TechRecordComponent implements OnDestroy {
  vehicleTechRecord$: Observable<VehicleTechRecordModel | undefined>;

  private destroy$ = new Subject<void>();

  constructor(private technicalRecordService: TechnicalRecordService, private route: ActivatedRoute, public spinnerService: SpinnerService) {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const vin = params.get('vin') ?? '';
      this.technicalRecordService.searchBy({ type: 'vin', searchTerm: vin });
    });
    this.vehicleTechRecord$ = this.technicalRecordService.selectedVehicleTechRecord$;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
