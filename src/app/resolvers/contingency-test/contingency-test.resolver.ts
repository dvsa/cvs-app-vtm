import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TechRecordType as VehicleType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { TestResultModel } from '@models/test-results/test-result.model';
import { TypeOfTest } from '@models/test-results/typeOfTest.enum';
import { TestType } from '@models/test-types/test-type.model';
import { V3TechRecordModel } from '@models/vehicle-tech-record.model';
import { Store } from '@ngrx/store';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { State } from '@store/.';
import { selectTechRecord } from '@store/technical-records';
import { initialContingencyTest } from '@store/test-records';
import {
  catchError, map, of, switchMap, take, tap, withLatestFrom,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export const contingencyTestResolver: ResolveFn<boolean> = () => {
  const store: Store<State> = inject(Store<State>);
  const techRecordService: TechnicalRecordService = inject(TechnicalRecordService);
  const userService: UserService = inject(UserService);
  return techRecordService.techRecord$.pipe(
    switchMap((techRecord) => {
      const { vin, systemNumber } = techRecord as TechRecordType<'get'>;
      const vrm = techRecord?.techRecord_vehicleType !== 'trl' ? techRecord?.primaryVrm : undefined;
      const trailerId = techRecord?.techRecord_vehicleType === 'trl' ? techRecord.trailerId : undefined;
      return store.select(selectTechRecord).pipe(
        withLatestFrom(userService.user$),
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
              (viewableTechRecord?.techRecord_vehicleType === 'psv'
                || viewableTechRecord?.techRecord_vehicleType === 'trl'
                || viewableTechRecord?.techRecord_vehicleType === 'hgv'
                || viewableTechRecord?.techRecord_vehicleType === 'motorcycle')
              && 'techRecord_vehicleClass_code' in viewableTechRecord
                ? {
                  code: viewableTechRecord?.techRecord_vehicleClass_code,
                  description: viewableTechRecord?.techRecord_vehicleClass_description,
                }
                : null,
            vehicleSubclass:
              viewableTechRecord && 'techRecord_vehicleSubclass' in viewableTechRecord ? viewableTechRecord.techRecord_vehicleSubclass : null,
            noOfAxles: viewableTechRecord?.techRecord_noOfAxles ?? 0,
            numberOfWheelsDriven:
              viewableTechRecord && 'techRecord_numberOfWheelsDriven' in viewableTechRecord
                ? viewableTechRecord.techRecord_numberOfWheelsDriven
                : null,
            testStatus: 'submitted',
            regnDate: viewableTechRecord?.techRecord_regnDate,
            numberOfSeats:
              ((viewableTechRecord as VehicleType<'psv'>)?.techRecord_seatsLowerDeck ?? 0)
              + ((viewableTechRecord as VehicleType<'psv'>)?.techRecord_seatsUpperDeck ?? 0),
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
            make: getBodyMake(viewableTechRecord),
            model: getBodyModel(viewableTechRecord),
            bodyType: getBodyType(viewableTechRecord),
            testTypes: [
              {
                testResult: 'pass',
                prohibitionIssued: null,
                additionalCommentsForAbandon: null,
              } as TestType,
            ],
          } as Partial<TestResultModel>;
        }),
      );
    }),
    tap((testResult) => {
      store.dispatch(initialContingencyTest({ testResult }));
    }),
    take(1),
    map(() => {
      return true;
    }),
    catchError(() => {
      return of(false);
    }),
  );
};

export function getBodyMake(techRecord: V3TechRecordModel | undefined) {
  if (techRecord?.techRecord_vehicleType === 'psv') {
    return techRecord.techRecord_bodyMake;
  }

  if (techRecord?.techRecord_vehicleType === 'hgv' || techRecord?.techRecord_vehicleType === 'trl') {
    return techRecord.techRecord_make;
  }

  return undefined;
}

export function getBodyModel(techRecord: V3TechRecordModel | undefined) {
  if (techRecord?.techRecord_vehicleType === 'psv') {
    return techRecord.techRecord_bodyModel;
  }

  if (techRecord?.techRecord_vehicleType === 'hgv' || techRecord?.techRecord_vehicleType === 'trl') {
    return techRecord.techRecord_model;
  }

  return undefined;
}

export function getBodyType(techRecord: V3TechRecordModel | undefined) {
  const vehicleType = techRecord?.techRecord_vehicleType;

  if (!vehicleType || (vehicleType !== 'hgv' && vehicleType !== 'psv' && vehicleType !== 'trl')) return undefined;

  return {
    code: techRecord.techRecord_bodyType_code,
    description: techRecord.techRecord_bodyType_description,
  };
}
