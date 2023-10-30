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
import {
  catchError,
  map,
  of,
  take,
  tap,
} from 'rxjs';

export const techRecordValidateResolver: ResolveFn<boolean> = () => {
  const store: Store<State> = inject(Store<State>);

  return store.select(selectTechRecord).pipe(
    map((record) => {
      let validatedRecord = { ...record };

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
      return validatedRecord as TechRecordType<'put'>;

    }),
    tap((vehicleTechRecord) => {
      store.dispatch(updateEditingTechRecord({ vehicleTechRecord }));
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
  };
  Object.keys(checks).forEach((key: string) => {
    if (record[key as keyof TechRecordVehicleType<'psv'>]) {

      const valid = Object.values(key).includes(checks[`${key}`]);
      if (!valid) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (validatedRecord as any)[`${key}`] = null;
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
  Object.keys(checks).forEach((key: string) => {
    if (record[key as keyof TechRecordVehicleType<'trl'>]) {
      const valid = Object.values(key).includes(checks[`${key}`]);
      if (!valid) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (validatedRecord as any)[`${key}`] = null;
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
  Object.keys(checks).forEach((key: string) => {
    if (record[key as keyof TechRecordVehicleType<'hgv'>]) {
      const valid = Object.values(key).includes(checks[`${key}`]);
      if (!valid) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (validatedRecord as any)[`${key}`] = null;
      }
    }
  });
  return validatedRecord as TechRecordType<'put'>;
};
