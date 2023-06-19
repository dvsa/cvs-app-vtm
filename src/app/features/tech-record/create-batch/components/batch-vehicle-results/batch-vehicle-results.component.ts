import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { filter, race, Subject, take, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-batch-vehicle-results',
  templateUrl: './batch-vehicle-results.component.html'
})
export class BatchVehicleResultsComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private technicalRecordService: TechnicalRecordService,
    private router: Router,
    private route: ActivatedRoute,
    private batchTechRecordService: BatchTechnicalRecordService
  ) {
    this.batchTechRecordService.batchCount$.pipe(take(1)).subscribe(count => {
      if (!count) this.router.navigate(['../..'], { relativeTo: this.route });
    });

    race(
      this.batchTechRecordService.batchCreatedCount$.pipe(
        withLatestFrom(this.batchTechRecordService.batchCount$),
        filter(([created, total]) => created === total)
      ),
      this.destroy$
    )
      .pipe(take(1))
      .subscribe(() => {
        this.technicalRecordService.clearEditingTechRecord();
      });
  }

  ngOnDestroy(): void {
    this.batchTechRecordService.clearBatch();
    this.destroy$.next();
    this.destroy$.complete();
  }

  get vehicleType$() {
    return this.batchTechRecordService.vehicleType$;
  }

  get applicationId$() {
    return this.batchTechRecordService.applicationId$;
  }

  get batchVehiclesSuccess$() {
    return this.batchTechRecordService.batchVehiclesSuccess$;
  }

  get vehicleStatus() {
    return StatusCodes;
  }

  get batchCount$() {
    return this.batchTechRecordService.batchCount$;
  }

  get batchSuccessCount$() {
    return this.batchTechRecordService.batchSuccessCount$;
  }

  get batchTotalCreatedCount$() {
    return this.batchTechRecordService.batchTotalCreatedCount$;
  }

  get batchTotalUpdatedCount$() {
    return this.batchTechRecordService.batchTotalUpdatedCount$;
  }

  get batchCreatedCount$() {
    return this.batchTechRecordService.batchCreatedCount$;
  }

  get batchUpdatedCount$() {
    return this.batchTechRecordService.batchUpdatedCount$;
  }
}
