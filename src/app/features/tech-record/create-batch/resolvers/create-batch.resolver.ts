import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { StatusCodes, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { Observable, of, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateBatchResolver implements Resolve<boolean> {
  constructor(private trs: TechnicalRecordService) {}
  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {
    this.trs.editableVehicleTechRecord$.pipe(take(1)).subscribe(
      vehicle =>
        !vehicle &&
        this.trs.updateEditingTechRecord({
          techRecord: [{ vehicleType: route.paramMap.get('vehicleType'), statusCode: StatusCodes.PROVISIONAL }]
        } as VehicleTechRecordModel)
    );

    this.trs.generateEditingVehicleTechnicalRecordFromVehicleType(route.paramMap.get('vehicleType') as VehicleTypes);

    return of(true);
  }
}
