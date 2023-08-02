import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TypeOfTest } from '@models/test-results/typeOfTest.enum';
import { TestType } from '@models/test-types/test-type.model';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { State } from '@store/.';
import { selectTechRecord } from '@store/technical-records';
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
    return this.store.select(selectTechRecord).pipe(
      switchMap(techRecord => {
        const { vin, primaryVrm, systemNumber } = techRecord!;
        const trailerId = (techRecord as any).trailerId;
        return this.store.select(selectTechRecord).pipe(
          withLatestFrom(this.userService.user$),
          map(([viewableTechRecord, user]) => {
            const now = new Date();
            return {
              vin,
              vrm: primaryVrm,
              trailerId,
              systemNumber,
              vehicleType: viewableTechRecord?.techRecord_vehicleType,
              statusCode: viewableTechRecord?.techRecord_statusCode,
              testResultId: uuidv4(),
              euVehicleCategory: viewableTechRecord?.techRecord_euVehicleCategory ?? null,
              vehicleSize: (viewableTechRecord as any)?.techRecord_vehicleSize,
              vehicleConfiguration: viewableTechRecord?.techRecord_vehicleConfiguration ?? null,
              vehicleClass: (viewableTechRecord as any)?.techRecord_vehicleClass ?? null,
              vehicleSubclass: (viewableTechRecord as any)?.techRecord_vehicleSubclass ?? null,
              noOfAxles: viewableTechRecord?.techRecord_noOfAxles ?? 0,
              numberOfWheelsDriven: (viewableTechRecord as any)?.techRecord_numberOfWheelsDriven ?? null,
              testStatus: 'submitted',
              regnDate: viewableTechRecord?.techRecord_regnDate,
              numberOfSeats:
                ((viewableTechRecord as any)?.techRecord_seatsLowerDeck ?? 0) + ((viewableTechRecord as any)?.techRecord_seatsUpperDeck ?? 0),
              reasonForCancellation: '',
              createdAt: now.toISOString(),
              lastUpdatedAt: now.toISOString(),
              firstUseDate: (viewableTechRecord as any)?.firstUseDate ?? null,
              createdByName: user.name,
              createdById: user.oid,
              lastUpdatedByName: user.name,
              lastUpdatedById: user.oid,
              typeOfTest: TypeOfTest.CONTINGENCY,
              source: 'vtm',
              testTypes: [
                {
                  testResult: 'pass',
                  prohibitionIssued: null,
                  additionalCommentsForAbandon: null
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
      catchError(() => {
        return of(false);
      })
    );
  }
}
