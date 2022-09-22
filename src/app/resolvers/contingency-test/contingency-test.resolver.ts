import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TypeOfTest } from '@models/test-results/typeOfTest.enum';
import { TestType } from '@models/test-types/test-type.model';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { State } from '@store/.';
import { initialContingencyTest } from '@store/test-records';
import { catchError, map, Observable, of, switchMap, take, tap, withLatestFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ContingencyTestResolver implements Resolve<boolean> {
  constructor(
    private store: Store<State>,
    private action$: Actions,
    private techRecordService: TechnicalRecordService,
    private userService: UserService
  ) {}

  resolve(): Observable<boolean> {
    return this.techRecordService.selectedVehicleTechRecord$.pipe(
      switchMap(techRecord => {
        const { vin, vrms, systemNumber } = techRecord!;
        const vrm = vrms.find(vrm => vrm.isPrimary);
        return this.techRecordService.viewableTechRecord$(techRecord!).pipe(
          withLatestFrom(this.userService.user$),
          map(([viewableTechRecord, user]) => {
            const now = new Date();
            return {
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
              testStatus: 'submitted',
              regnDate: viewableTechRecord?.regnDate,
              numberOfSeats: (viewableTechRecord?.seatsLowerDeck ?? 0) + (viewableTechRecord?.seatsUpperDeck ?? 0),
              reasonForCancellation: '',
              createdAt: now.toISOString(),
              lastUpdatedAt: now.toISOString(),
              firstUseDate: viewableTechRecord?.firstUseDate ?? null,
              createdByName: user.name,
              createdById: user.oid,
              lastUpdatedByName: user.name,
              lastUpdatedById: user.oid,
              typeOfTest: TypeOfTest.CONTINGENCY,
              source: 'vtm',
              testTypes: [
                {
                  testResult: 'pass',
                  prohibitionIssued: null
                } as TestType
              ]
            } as Partial<TestResultModel>;
          })
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
