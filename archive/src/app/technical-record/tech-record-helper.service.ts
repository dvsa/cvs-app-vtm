import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { RECORD_STATUS, VEHICLE_TYPES, RECORD_COMPLETENESS } from '@app/app.enums';

@Injectable({ providedIn: 'root' })
export class TechRecordHelperService {
  _noOfAxles = new Subject<number>();

  constructor() {}

  isStandardVehicle(vehicleType: string): boolean {
    return (
      VEHICLE_TYPES.HGV === vehicleType ||
      VEHICLE_TYPES.TRL === vehicleType ||
      VEHICLE_TYPES.PSV === vehicleType
    );
  }

  isHgvOrTrlVehicle(vehicleType: string): boolean {
    return VEHICLE_TYPES.HGV === vehicleType || VEHICLE_TYPES.TRL === vehicleType;
  }

  isPsvOrTrlVehicle(vehicleType: string): boolean {
    return VEHICLE_TYPES.PSV === vehicleType || VEHICLE_TYPES.TRL === vehicleType;
  }

  isArchivedRecord(recordStatus: string): boolean {
    return RECORD_STATUS.ARCHIVED === recordStatus;
  }

  setNumberOfAxles(numOfAxles: number): void {
    this._noOfAxles.next(numOfAxles);
  }

  getNumberOfAxles(): Observable<number> {
    return this._noOfAxles.asObservable();
  }

  getCompletenessInfoByKey(completeness: string): string {
    const completenessKey = Object.keys(RECORD_COMPLETENESS).find(
      (name) => name === completeness
    );

    return RECORD_COMPLETENESS[completenessKey];
  }
}
