import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StatusCodes } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-batch-trl-results',
  templateUrl: './batch-trl-results.component.html',
  styleUrls: ['./batch-trl-results.component.scss']
})
export class BatchTrlResultsComponent implements OnInit {
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

  get applicationId$() {
    return this.technicalRecordService.applicationId$;
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
