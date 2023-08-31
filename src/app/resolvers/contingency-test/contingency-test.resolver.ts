import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { TechRecordType as VehicleType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
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

  //TODO: remove the anys
  resolve(): Observable<boolean> {
    return this.techRecordService.techRecord$.pipe(
      switchMap(techRecord => {
        const { vin, systemNumber } = techRecord as TechRecordType<'get'>;
        const vrm = techRecord?.techRecord_vehicleType !== 'trl' ? techRecord?.primaryVrm : undefined;
        const trailerId = techRecord?.techRecord_vehicleType === 'trl' ? techRecord.trailerId : undefined;
        return this.store.select(selectTechRecord).pipe(
          withLatestFrom(this.userService.user$),
          map(([viewableTechRecord, user]) => {
            const now = new Date();
            return {
              vin,
              vrm,
              trailerId,
              systemNumber,
              vehicleType: viewableTechRecord?.techRecord_vehicleType,
              statusCode: viewableTechRecord?.techRecord_statusCode,
              testResultId: uuidv4(),
              euVehicleCategory: (viewableTechRecord as TechRecordType<'get'>)?.techRecord_euVehicleCategory ?? null,
              vehicleSize: viewableTechRecord?.techRecord_vehicleType === 'psv' ? viewableTechRecord?.techRecord_vehicleSize : undefined,
              vehicleConfiguration: (viewableTechRecord as TechRecordType<'get'>)?.techRecord_vehicleConfiguration ?? null,
              vehicleClass:
                viewableTechRecord?.techRecord_vehicleType === 'psv' ||
                viewableTechRecord?.techRecord_vehicleType === 'trl' ||
                viewableTechRecord?.techRecord_vehicleType === 'hgv' ||
                viewableTechRecord?.techRecord_vehicleType === 'motorcycle'
                  ? {
                      code: (viewableTechRecord as any)?.techRecord_vehicleClass_code,
                      description: viewableTechRecord?.techRecord_vehicleClass_description
                    }
                  : null,
              vehicleSubclass: (viewableTechRecord as any)?.techRecord_vehicleSubclass ?? null,
              noOfAxles: viewableTechRecord?.techRecord_noOfAxles ?? 0,
              numberOfWheelsDriven: (viewableTechRecord as any)?.techRecord_numberOfWheelsDriven ?? null,
              testStatus: 'submitted',
              regnDate: viewableTechRecord?.techRecord_regnDate,
              numberOfSeats:
                ((viewableTechRecord as VehicleType<'psv'>)?.techRecord_seatsLowerDeck ?? 0) +
                ((viewableTechRecord as VehicleType<'psv'>)?.techRecord_seatsUpperDeck ?? 0),
              reasonForCancellation: '',
              createdAt: now.toISOString(),
              lastUpdatedAt: now.toISOString(),
              firstUseDate: viewableTechRecord?.techRecord_vehicleType === 'trl' ? viewableTechRecord?.techRecord_firstUseDate : null,
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
      catchError(err => {
        return of(false);
      })
    );
  }
}
