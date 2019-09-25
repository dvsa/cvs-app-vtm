import {Observable, of} from "rxjs";

export class TechnicalRecordServiceMock {

  getTechnicalRecords(): Observable<any> {
    return of({vin: "XXXXX11XX1X111111", techRecord: [], vrms: []});
  }

}
