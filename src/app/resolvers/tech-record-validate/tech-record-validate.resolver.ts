import { inject } from '@angular/core';
import {
  ResolveFn,
} from '@angular/router';
import { VehicleClassDescription } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleClassDescriptionPSV.enum.js';
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
  if (!Object.values(VehicleClassDescription).includes(validatedRecord.techRecord_vehicleClass_description)) {
    (validatedRecord as any).techRecord_vehicleClass_description = null;
  }
  const checks = {
    techRecord_vehicleConfiguration: HgvPsvVehicleConfiguration,
    techRecord_vehicleClass_description: VehicleClassDescription,
  } as const;

  type Checks = typeof checks;
  type CheckKey = keyof Checks;

  const keys = Object.keys(checks) as CheckKey[];

  keys.forEach((key) => {
    if (record[key as keyof TechRecordVehicleType<'psv'>]) {
      const valid = Object.values(checks).includes(checks[`${key}`]);
      if (!valid) {
        (validatedRecord as any)[`${key}`] = null;
      }
    }
  });
  return validatedRecord as TechRecordType<'put'>;
};

const handleTrl = (record: TechRecordVehicleType<'trl'>) => {
  const validatedRecord: TechRecordVehicleType<'trl'> = { ...record };
  validatedRecord.techRecord_vehicleClass_description = 'trailer';

  const checks = {
    techRecord_vehicleConfiguration: TrlVehicleConfiguration,
  };

  type Checks = typeof checks;
  type CheckKey = keyof Checks;

  const keys = Object.keys(checks) as CheckKey[];

  keys.forEach((key: CheckKey) => {
    if (record[key as keyof TechRecordVehicleType<'trl'>]) {
      const valid = Object.values(checks).includes(checks[`${key}`]);
      if (!valid) {
        validatedRecord[`${key}`] = null;
      }
    }
  });
  return validatedRecord as TechRecordType<'put'>;
};

const handleHgv = (record: TechRecordVehicleType<'hgv'>) => {
  const validatedRecord: TechRecordVehicleType<'hgv'> = { ...record };
  validatedRecord.techRecord_vehicleClass_description = 'heavy goods vehicle';

  const checks = {
    techRecord_vehicleConfiguration: HgvPsvVehicleConfiguration,
  };

  type Checks = typeof checks;
  type CheckKey = keyof Checks;

  const keys = Object.keys(checks) as CheckKey[];

  keys.forEach((key: CheckKey) => {
    if (record[key as keyof TechRecordVehicleType<'hgv'>]) {
      const valid = Object.values(checks).includes(checks[`${key}`]);
      if (!valid) {
        validatedRecord[`${key}`] = null;
      }
    }
  });
  return validatedRecord as TechRecordType<'put'>;
};
