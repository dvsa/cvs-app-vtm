import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalErrorService } from '@core/components/global-error/global-error.service';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { createVehicleRecord, createVehicleRecordSuccess } from '@store/technical-records';
import { TechnicalRecordServiceState } from '@store/technical-records/reducers/technical-record-service.reducer';
import { Observable, take, tap } from 'rxjs';
import { TechRecordSummaryComponent } from '../../../tech-record/components/tech-record-summary/tech-record-summary.component';

@Component({
  selector: 'app-hydrate-new-vehicle-record',
  templateUrl: './hydrate-new-vehicle-record.component.html'
})
export class HydrateNewVehicleRecordComponent {
  @ViewChild(TechRecordSummaryComponent) summary?: TechRecordSummaryComponent;
  isInvalid: boolean = false;

  constructor(
    private actions$: Actions,
    private globalErrorService: GlobalErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<TechnicalRecordServiceState>,
    private technicalRecordService: TechnicalRecordService
  ) {}

  get vehicle$(): Observable<VehicleTechRecordModel | undefined> {
    return this.technicalRecordService.editableVehicleTechRecord$.pipe(
      tap(vehicle => {
        if (!vehicle) this.navigateBack();
      })
    );
  }

  handleSubmit() {
    if (!this.isInvalid) {
      this.store.dispatch(createVehicleRecord());
      this.actions$.pipe(ofType(createVehicleRecordSuccess), take(1)).subscribe(() => this.navigateBack());
    }
  }

  navigateBack() {
    this.globalErrorService.clearErrors();
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
