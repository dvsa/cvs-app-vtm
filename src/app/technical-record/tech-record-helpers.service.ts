import { Injectable } from '@angular/core';
import { VEHICLE_TYPES } from '@app/app.enums';

@Injectable({
  providedIn: 'root'
})
export class TechRecordHelpersService {
  constructor() {}

  isStandardVehicle(vehicleType: string): boolean {
    return (
      VEHICLE_TYPES.HGV === vehicleType ||
      VEHICLE_TYPES.TRL === vehicleType ||
      VEHICLE_TYPES.PSV === vehicleType
    );
  }
}
