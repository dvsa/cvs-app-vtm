import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import {
  EuVehicleCategories,
  StatusCodes,
  TechRecordModel,
  V3TechRecordModel,
  VehicleTechRecordModel,
  VehicleTypes
} from '@models/vehicle-tech-record.model';
import { Store, select } from '@ngrx/store';
import { RouterService } from '@services/router/router.service';
import { SEARCH_TYPES, TechnicalRecordHttpService } from '@services/technical-record-http/technical-record-http.service';
import {
  selectTechRecordSearchResults,
  selectTechRecordSearchResultsBySystemNumber
} from '@store/tech-record-search/selector/tech-record-search.selector';
import {
  clearAllSectionStates,
  createVehicle,
  selectSectionState,
  selectTechRecord,
  techRecord,
  updateEditingTechRecord,
  updateEditingTechRecordCancel
} from '@store/technical-records';
import { cloneDeep } from 'lodash';
import { Observable, catchError, combineLatest, debounceTime, filter, map, of, switchMap, take, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TechnicalRecordService {
  constructor(private store: Store, private techRecordHttpService: TechnicalRecordHttpService, private routerService: RouterService) {}

  getVehicleTypeWithSmallTrl(techRecord: V3TechRecordModel): VehicleTypes {
    return techRecord.techRecord_vehicleType === VehicleTypes.TRL &&
      (techRecord.techRecord_euVehicleCategory === EuVehicleCategories.O1 || techRecord.techRecord_euVehicleCategory === EuVehicleCategories.O2)
      ? (VehicleTypes.SMALL_TRL as VehicleTypes)
      : (techRecord.techRecord_vehicleType as VehicleTypes);
  }

  isUnique(valueToCheck: string, searchType: SEARCH_TYPES): Observable<boolean> {
    return this.techRecordHttpService.search$(searchType, valueToCheck).pipe(
      map(searchResults => {
        if (searchResults.every(result => result.techRecord_statusCode === StatusCodes.ARCHIVED)) {
          return true;
        }

        if (searchType === SEARCH_TYPES.VRM) {
          return !searchResults.some(result => result.primaryVrm === valueToCheck);
        }

        return false;
      }),
      catchError((error: HttpErrorResponse) => {
        return (error.status == 404 && of(true)) || throwError(() => error);
      })
    );
  }

  get techRecord$(): Observable<V3TechRecordModel | undefined> {
    return combineLatest([
      this.store.pipe(select(selectTechRecord)),
      this.store.pipe(select(techRecord)),
      this.routerService.getRouteDataProperty$('isEditing')
    ]).pipe(
      tap(([techRecord, nonEditingTechRecord, isEditing]) => {
        if (isEditing && !techRecord && nonEditingTechRecord) {
          this.updateEditingTechRecord(nonEditingTechRecord as TechRecordType<'put'>);
        }
      }),
      map(([techRecord, nonEditingTechRecord, isEditing]) => (isEditing && !techRecord ? nonEditingTechRecord : techRecord))
    );
  }

  updateEditingTechRecord(record: TechRecordType<'put'>): void {
    if (record.techRecord_vehicleType === 'psv' || record.techRecord_vehicleType === 'hgv' || record.techRecord_vehicleType === 'trl') {
      record.techRecord_noOfAxles = record.techRecord_axles && record.techRecord_axles.length > 0 ? record.techRecord_axles?.length : null;
    }
    this.store.dispatch(updateEditingTechRecord({ vehicleTechRecord: record }));
  }

  /**
   * A function to filter the correct tech record, this has a hierarchy which is CURRENT -> PROVISIONAL -> ARCHIVED.
   * @param record This is a VehicleTechRecordModel passed in from the parent component
   * @returns returns the tech record of correct hierarchy precedence or if none exists returns undefined
   */
  static filterTechRecordByStatusCode(record: VehicleTechRecordModel): TechRecordModel | undefined {
    return (
      record.techRecord.find(record => record.statusCode === StatusCodes.CURRENT) ??
      record.techRecord.find(record => record.statusCode === StatusCodes.PROVISIONAL) ??
      record.techRecord.find(record => record.statusCode === StatusCodes.ARCHIVED)
    );
  }

  generateEditingVehicleTechnicalRecordFromVehicleType(vehicleType: VehicleTypes): void {
    this.store.dispatch(createVehicle({ techRecord_vehicleType: vehicleType }));
  }

  clearReasonForCreation(vehicleTechRecord?: TechRecordType<'put'>): void {
    this.techRecord$
      .pipe(
        map(data => cloneDeep(data ?? vehicleTechRecord)),
        take(1)
      )
      .subscribe(data => {
        if (data) {
          data.techRecord_reasonForCreation = '';
          this.updateEditingTechRecord(data as TechRecordType<'put'>);
        }
      });
  }

  validateVinForUpdate(originalVin?: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return of(control.value).pipe(
        filter((value: string) => !!value),
        debounceTime(1000),
        take(1),
        switchMap(value => {
          return this.isUnique(value, SEARCH_TYPES.VIN).pipe(
            map(result => {
              if (control.value === originalVin) {
                return { validateVin: { message: 'You must provide a new VIN' } };
              } else {
                return result
                  ? null
                  : { validateVin: { message: 'This VIN already exists, if you continue it will be associated with two vehicles' } };
              }
            }),
            catchError(() => of(null))
          );
        })
      );
    };
  }

  clearEditingTechRecord() {
    this.store.dispatch(updateEditingTechRecordCancel());
  }

  get searchResults$(): Observable<TechRecordSearchSchema[] | undefined> {
    return this.store.pipe(select(selectTechRecordSearchResults));
  }

  get searchResultsWithUniqueSystemNumbers$(): Observable<TechRecordSearchSchema[] | undefined> {
    return this.store.pipe(select(selectTechRecordSearchResultsBySystemNumber));
  }
  get techRecordStatus$(): Observable<StatusCodes | undefined> {
    return this.techRecord$.pipe(map(techRecord => techRecord?.techRecord_statusCode as StatusCodes | undefined));
  }

  get sectionStates$(): Observable<(string | number)[] | undefined> {
    return this.store.pipe(select(selectSectionState));
  }

  //TODO: remove the anys
  getMakeAndModel(techRecord: V3TechRecordModel): string {
    if (
      techRecord.techRecord_vehicleType === 'car' ||
      techRecord.techRecord_vehicleType === 'motorcycle' ||
      techRecord.techRecord_vehicleType === 'lgv'
    ) {
      return '';
    }

    return `${techRecord?.techRecord_vehicleType === 'psv' ? techRecord.techRecord_chassisMake : techRecord.techRecord_make} - ${
      techRecord.techRecord_vehicleType === 'psv' ? techRecord.techRecord_chassisModel : techRecord.techRecord_model
    }`;
  }

  clearSectionTemplateStates() {
    this.store.dispatch(clearAllSectionStates());
  }
}
