import { Injectable } from '@angular/core';
import { VEHICLE_TYPES } from '@app/app.enums';
import { Subject, Observable } from 'rxjs';

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

  setNumberOfAxles(numOfAxles: number): void {
    this._noOfAxles.next(numOfAxles);
  }

  getNumberOfAxles(): Observable<number> {
    return this._noOfAxles.asObservable();
  }
}
