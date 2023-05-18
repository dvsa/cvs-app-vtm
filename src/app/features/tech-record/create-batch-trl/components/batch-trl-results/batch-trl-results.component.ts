import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { filter, race, Subject, take, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-batch-trl-results',
  templateUrl: './batch-trl-results.component.html'
})
export class BatchTrlResultsComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(private technicalRecordService: TechnicalRecordService, private router: Router, private route: ActivatedRoute) {
    this.technicalRecordService.editableVehicleTechRecord$.pipe(take(1)).subscribe(vehicle => {
      if (!vehicle) this.router.navigate(['..'], { relativeTo: this.route });
    });

    this.technicalRecordService.batchCount$.pipe(take(1)).subscribe(count => {
      if (!count) this.router.navigate(['../..'], { relativeTo: this.route });
    });

    race(
      this.technicalRecordService.batchCreatedCount$.pipe(
        withLatestFrom(this.technicalRecordService.batchCount$),
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
    this.technicalRecordService.clearBatch();
    this.destroy$.next();
    this.destroy$.complete();
  }

  get applicationId$() {
    return this.technicalRecordService.applicationId$;
  }

  get batchVehiclesSuccess$() {
    return this.technicalRecordService.batchVehiclesSuccess$;
  }

  get vehicleStatus() {
    return StatusCodes;
  }

  get batchCount$() {
    return this.technicalRecordService.batchCount$;
  }

  get batchSuccessCount$() {
    return this.technicalRecordService.batchSuccessCount$;
  }

  get batchTotalCreatedCount$() {
    return this.technicalRecordService.batchTotalCreatedCount$;
  }

  get batchTotalUpdatedCount$() {
    return this.technicalRecordService.batchTotalUpdatedCount$;
  }

  get batchCreatedCount$() {
    return this.technicalRecordService.batchCreatedCount$;
  }

  get batchUpdatedCount$() {
    return this.technicalRecordService.batchUpdatedCount$;
  }
}
