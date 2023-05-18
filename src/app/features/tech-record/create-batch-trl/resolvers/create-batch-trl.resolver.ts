import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { StatusCodes, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { Observable, of, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateBatchTrlResolver implements Resolve<boolean> {
  constructor(private trs: TechnicalRecordService) {}
  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {
    this.trs.editableVehicleTechRecord$.pipe(take(1)).subscribe(
      vehicle =>
        !vehicle &&
        this.trs.updateEditingTechRecord({
          techRecord: [{ vehicleType: VehicleTypes.TRL, statusCode: StatusCodes.PROVISIONAL }]
        } as VehicleTechRecordModel)
    );

    this.trs.generateEditingVehicleTechnicalRecordFromVehicleType(VehicleTypes.TRL);

    return of(true);
  }
}
