import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TestType } from '@models/test-types/test-type.model';
import { Actions } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { State } from '@store/.';
import { selectRouteNestedParams } from '@store/router/selectors/router.selectors';
import { initialContingencyTest } from '@store/test-records';
import { catchError, map, Observable, of, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ContingencyTestResolver implements Resolve<boolean> {
  constructor(private store: Store<State>, private action$: Actions, private techRecordService: TechnicalRecordService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.techRecordService.selectedVehicleTechRecord$.pipe(
      switchMap(techRecord => {
        const { vin, vrms, systemNumber } = techRecord!;
        const vrm = vrms.find(vrm => vrm.isPrimary);
        return this.techRecordService.viewableTechRecord$(techRecord!).pipe(
          map(
            viewableTechRecord =>
              ({
                vin,
                vrm: vrm?.vrm,
                systemNumber,
                vehicleType: viewableTechRecord?.vehicleType,
                testResultId: uuidv4(),
                euVehicleCategory: viewableTechRecord?.euVehicleCategory,
                vehicleSize: viewableTechRecord?.vehicleSize,
                vehicleConfiguration: viewableTechRecord?.vehicleConfiguration,
                vehicleClass: viewableTechRecord?.vehicleClass,
                noOfAxles: viewableTechRecord?.noOfAxles,
                numberOfWheelsDriven: viewableTechRecord?.numberOfWheelsDriven,
                testStartTimestamp: new Date().toISOString(),
                testStatus: 'submitted',
                testerStaffId: 'leeb',
                regnDate: viewableTechRecord?.regnDate,
                numberOfSeats: (viewableTechRecord?.seatsLowerDeck ?? 0) + (viewableTechRecord?.seatsUpperDeck ?? 0),
                reasonForCancellation: '',
                lastUpdatedAt: new Date().toISOString(),
                testTypes: [
                  {
                    testResult: 'pass'
                  } as TestType
                ]
              } as Partial<TestResultModel>)
          )
        );
      }),
      tap(testResult => {
        this.store.dispatch(initialContingencyTest({ testResult }));
      }),
      take(1),
      map(() => {
        return true;
      }),
      catchError(e => {
        return of(false);
      })
    );
  }
}
