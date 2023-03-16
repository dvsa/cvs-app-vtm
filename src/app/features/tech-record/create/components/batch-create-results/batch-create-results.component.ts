import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-batch-create-results',
  templateUrl: './batch-create-results.component.html'
})
export class BatchCreateResultsComponent implements OnInit {
  constructor(private technicalRecordService: TechnicalRecordService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.technicalRecordService.editableVehicleTechRecord$.pipe(take(1)).subscribe(vehicle => {
      if (!vehicle) this.back();
    });

    this.technicalRecordService.batchCount$.pipe(take(1)).subscribe({
      next: count => {
        if (!count) {
          this.router.navigate(['../..'], { relativeTo: this.route });
        }
      }
    });
  }

  get leadRecord$() {
    return this.technicalRecordService.editableVehicleTechRecord$;
  }

  get batchVehiclesCreated$() {
    return this.technicalRecordService.batchVehiclesCreated$;
  }

  get vehicleStatus() {
    return StatusCodes;
  }

  get batchCount$() {
    return this.technicalRecordService.batchCount$;
  }
  get batchCreatedCount$() {
    return this.technicalRecordService.batchCreatedCount$;
  }

  back() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
