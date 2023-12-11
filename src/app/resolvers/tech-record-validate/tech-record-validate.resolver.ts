import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
} from '@angular/router';
import { ApprovalType as approvalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { ApprovalType as approvalTypeHgvOrPsv } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalTypeHgvOrPsv.enum.js';
import { EUVehicleCategory as EUVehicleCategoryTrl } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { EUVehicleCategory as EUVehicleCategoryHgv } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryHgv.enum.js';
import { EUVehicleCategory as EUVehicleCategoryPsv } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryPsv.enum.js';
import { TyreUseCode as HgvTyreUseCode } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/tyreUseCodeHgv.enum.js';
import { TyreUseCode as TrlTyreUseCode } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/tyreUseCodeTrl.enum.js';
import { VehicleClassDescription } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleClassDescription.enum.js';
import {
  VehicleClassDescription as VehicleClassDescriptionPSV,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleClassDescriptionPSV.enum.js';
import {
  VehicleConfiguration as VehicleConfigurationHgvPsv,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleConfigurationHgvPsv.enum.js';
import {
  VehicleConfiguration as VehicleConfigurationTrl,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleConfigurationTrl.enum.js';
import { TechRecordType as TechRecordVehicleType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { Store } from '@ngrx/store';
import { State } from '@store/.';
import { selectTechRecord, updateEditingTechRecord } from '@store/technical-records';
import { isEqual } from 'lodash';
import {
  map,
  take,
} from 'rxjs';

export const techRecordValidateResolver: ResolveFn<boolean> = (route: ActivatedRouteSnapshot) => {
  const store: Store<State> = inject(Store<State>);
  const router: Router = inject(Router);

  return store.select(selectTechRecord).pipe(
    map((record) => {
      if (!record) {
        void router.navigate([`./tech-records/${route.params['systemNumber']}/${route.params['createdTimestamp']}`]);
      }
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
      if (!isEqual(validatedRecord, record)) {
        store.dispatch(updateEditingTechRecord({ vehicleTechRecord: validatedRecord }));
      }
    }),
    take(1),
    map(() => {
      return true;
    }),
  );
};

const handlePsv = (record: TechRecordVehicleType<'psv'>) => {
  const validatedRecord: TechRecordVehicleType<'psv'> = { ...record };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checks: any = {
    techRecord_vehicleConfiguration: VehicleConfigurationHgvPsv,
    techRecord_vehicleClass_description: VehicleClassDescriptionPSV,
    techRecord_euVehicleCategory: EUVehicleCategoryPsv,
    techRecord_approvalType: approvalTypeHgvOrPsv,
  } as const;

  Object.keys(checks).forEach((key: string) => {
    if (record[key as keyof TechRecordVehicleType<'psv'>]) {
      const validateValues: boolean = Object.values(checks[`${key}`]).includes(record[key as keyof TechRecordVehicleType<'psv'>]);

      if (!validateValues) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (validatedRecord as any)[key as keyof TechRecordVehicleType<'hgv'>] = null;
      }
    }
  });
  return validatedRecord as TechRecordType<'put'>;
};

const handleTrl = (record: TechRecordVehicleType<'trl'>) => {
  const validatedRecord: TechRecordVehicleType<'trl'> = { ...record };
  validatedRecord.techRecord_vehicleClass_description = VehicleClassDescription.Trailer;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checks: any = {
    techRecord_tyreUseCode: TrlTyreUseCode,
    techRecord_vehicleConfiguration: VehicleConfigurationTrl,
    techRecord_euVehicleCategory: EUVehicleCategoryTrl,
    techRecord_approvalType: approvalType,
  };

  Object.keys(checks).forEach((key: string) => {
    if (record[key as keyof TechRecordVehicleType<'trl'>]) {
      const validateValues: boolean = Object.values(checks[`${key}`]).includes(record[key as keyof TechRecordVehicleType<'trl'>]);

      if (!validateValues) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (validatedRecord as any)[key as keyof TechRecordVehicleType<'hgv'>] = null;
      }
    }
  });
  return validatedRecord as TechRecordType<'put'>;
};

const handleHgv = (record: TechRecordVehicleType<'hgv'>) => {
  const validatedRecord: TechRecordVehicleType<'hgv'> = { ...record };
  validatedRecord.techRecord_vehicleClass_description = VehicleClassDescription.HeavyGoodsVehicle;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const checks: any = {
    techRecord_tyreUseCode: HgvTyreUseCode,
    techRecord_vehicleConfiguration: VehicleConfigurationHgvPsv,
    techRecord_euVehicleCategory: EUVehicleCategoryHgv,
    techRecord_approvalType: approvalTypeHgvOrPsv,
  };

  Object.keys(checks).forEach((key: string) => {
    if (record[key as keyof TechRecordVehicleType<'hgv'>]) {
      const validateValues: boolean = Object.values(checks[`${key}`]).includes(record[key as keyof TechRecordVehicleType<'hgv'>]);

      if (!validateValues) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (validatedRecord as any)[key as keyof TechRecordVehicleType<'hgv'>] = null;
      }
    }
  });
  return validatedRecord as TechRecordType<'put'>;
};
