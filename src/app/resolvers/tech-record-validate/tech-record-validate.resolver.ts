import { inject } from '@angular/core';
import {
  ResolveFn,
} from '@angular/router';
import { TechRecordType as TechRecordVehicleType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { HgvPsvVehicleConfiguration, TrlVehicleConfiguration } from '@models/vehicle-configuration.enum';
import { Store } from '@ngrx/store';
import { State } from '@store/.';
import { selectTechRecord, updateEditingTechRecord } from '@store/technical-records';
import * as _ from 'lodash';
import {
  catchError,
  map,
  of,
  take,
} from 'rxjs';

export const techRecordValidateResolver: ResolveFn<boolean> = () => {
  const store: Store<State> = inject(Store<State>);

  return store.select(selectTechRecord).pipe(
    map((record) => {
      let validatedRecord = { ...record } as TechRecordType<'put'>;

      if (record) {
        switch (true) {
          case (record?.techRecord_vehicleType === 'hgv'): {
            validatedRecord = handleHgv(record as TechRecordVehicleType<'hgv'>);
            break;
          }
          case (record?.techRecord_vehicleType === 'psv'): {
            validatedRecord = handlePsv(record as TechRecordVehicleType<'psv'>);
            break;
          }
          case (record?.techRecord_vehicleType === 'trl'): {
            validatedRecord = handleTrl(record as TechRecordVehicleType<'trl'>);
            break;
          }
          default: break;
        }
      }
      if (!_.isEqual(validatedRecord, record)) {
        store.dispatch(updateEditingTechRecord({ vehicleTechRecord: validatedRecord }));
      }
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

const handlePsv = (record: TechRecordVehicleType<'psv'>) => {
  const validatedRecord: TechRecordVehicleType<'psv'> = { ...record };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checks: any = {
    techRecord_vehicleConfiguration: HgvPsvVehicleConfiguration,
  } as const;

  Object.keys(checks).forEach((key: string, index: number) => {
    if (record[key as keyof TechRecordVehicleType<'psv'>]) {
      const validatorValues: boolean = Object.values(checks[`${key}`]).includes(record[key as keyof TechRecordVehicleType<'psv'>]);

      if (!validatorValues) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (validatedRecord as any)[key as keyof TechRecordVehicleType<'hgv'>] = null;
      }
    }
  });
  return validatedRecord as TechRecordType<'put'>;
};

const handleTrl = (record: TechRecordVehicleType<'trl'>) => {
  const validatedRecord: TechRecordVehicleType<'trl'> = { ...record };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checks: any = {
    techRecord_vehicleConfiguration: TrlVehicleConfiguration,
  };

  Object.keys(checks).forEach((key: string, index: number) => {
    if (record[key as keyof TechRecordVehicleType<'trl'>]) {
      const validatorValues: boolean = Object.values(checks[`${key}`]).includes(record[key as keyof TechRecordVehicleType<'trl'>]);

      if (!validatorValues) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (validatedRecord as any)[key as keyof TechRecordVehicleType<'hgv'>] = null;
      }
    }
  });
  return validatedRecord as TechRecordType<'put'>;
};

const handleHgv = (record: TechRecordVehicleType<'hgv'>) => {
  const validatedRecord: TechRecordVehicleType<'hgv'> = { ...record };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checks: any = {
    techRecord_vehicleConfiguration: HgvPsvVehicleConfiguration,
  };

  Object.keys(checks).forEach((key: string, index: number) => {
    if (record[key as keyof TechRecordVehicleType<'hgv'>]) {
      const validatorValues: boolean = Object.values(checks[`${key}`]).includes(record[key as keyof TechRecordVehicleType<'hgv'>]);

      if (!validatorValues) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (validatedRecord as any)[key as keyof TechRecordVehicleType<'hgv'>] = null;
      }
    }
  });
  return validatedRecord as TechRecordType<'put'>;
};
