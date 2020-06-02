import { Injectable } from '@angular/core';
import { VEHICLE_TYPES } from '@app/app.enums';

@Injectable({
  providedIn: 'root'
})
export class TechRecordHelpersService {
  constructor() {}

  isNullOrEmpty(str) {
    return typeof str === 'string' || str === null || str === undefined
      ? !str || !str.trim()
      : false;
  }

  isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0;
  }

  isStandardVehicle(vehicleType: string): boolean {
    return (
      VEHICLE_TYPES.HGV === vehicleType ||
      VEHICLE_TYPES.TRL === vehicleType ||
      VEHICLE_TYPES.PSV === vehicleType
    );
  }
}
