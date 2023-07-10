import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { EuVehicleCategories, StatusCodes, TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { Store, select } from '@ngrx/store';
import { SEARCH_TYPES, TechnicalRecordHttpService } from '@services/technical-record-http/technical-record-http.service';
import { SearchResult } from '@store/tech-record-search/reducer/tech-record-search.reducer';
import {
  selectTechRecordSearchResults,
  selectTechRecordSearchResultsBySystemNumber
} from '@store/tech-record-search/selector/tech-record-search.selector';
import {
  clearAllSectionStates,
  createVehicle,
  editableTechRecord,
  editableVehicleTechRecord,
  selectSectionState,
  selectTechRecord,
  selectVehicleTechnicalRecordsBySystemNumber,
  updateEditingTechRecord,
  updateEditingTechRecordCancel,
  vehicleTechRecords
} from '@store/technical-records';
import { cloneDeep } from 'lodash';
import { Observable, catchError, debounceTime, filter, map, of, switchMap, take, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TechnicalRecordService {
  constructor(private store: Store, private techRecordHttpService: TechnicalRecordHttpService) {}

  getVehicleTypeWithSmallTrl(techRecord: TechRecordModel): VehicleTypes {
    return techRecord.vehicleType === VehicleTypes.TRL &&
      (techRecord.euVehicleCategory === EuVehicleCategories.O1 || techRecord.euVehicleCategory === EuVehicleCategories.O2)
      ? VehicleTypes.SMALL_TRL
      : techRecord.vehicleType;
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

  /**
   * A function to get the correct tech record to create the summary display which uses time first then status code
   * @param vehicleRecord This is a VehicleTechRecordModel passed in from the parent component
   * @returns returns the tech record of correct hierarchy precedence or if none exists returns undefined
   */
  get viewableTechRecord$(): Observable<TechRecordModel | undefined> {
    return this.store.pipe(select(selectTechRecord));
  }

  /**
   * A function which takes either a TechRecordModel or a VehicleTechRecordModel, maps the missing vehicle record information if passed
   * a TechRecordModel and dispatches the action to update the editing tech record.
   * @param record - TechRecordModel or VehicleTechRecordModel
   * @param resetVehicleAttributes [resetVehicleAttributes=false] - Used to overwrite the attributes inside of the properties inside
   * the VehicleTechRecordModel to the un-edited information present in state for that vehicle. Only used if passed a TechRecordModel.
   * @returns void
   */
  updateEditingTechRecord(record: TechRecordModel | VehicleTechRecordModel, resetVehicleAttributes = false): void {
    const isVehicleRecord = (rec: TechRecordModel | VehicleTechRecordModel): rec is VehicleTechRecordModel => rec.hasOwnProperty('techRecord');

    if (isVehicleRecord(record) && record.techRecord.length > 1) {
      throw new Error('Editing tech record can only have one technical record!');
    }

    const vehicleTechRecord$: Observable<VehicleTechRecordModel | undefined> = isVehicleRecord(record)
      ? of(record)
      : this.store.pipe(
          select(editableVehicleTechRecord),
          switchMap(vehicleRecord => (vehicleRecord && !resetVehicleAttributes ? of(vehicleRecord) : this.selectedVehicleTechRecord$)),
          map(vehicleRecord => vehicleRecord && { ...vehicleRecord, techRecord: [record] })
        );

    vehicleTechRecord$.pipe(take(1)).subscribe(vehicleRecord => {
      if (vehicleRecord) {
        this.store.dispatch(updateEditingTechRecord({ vehicleTechRecord: vehicleRecord }));
      }
    });
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
    this.store.dispatch(createVehicle({ vehicleType: vehicleType }));
  }

  clearReasonForCreation(vehicleTechRecord?: VehicleTechRecordModel): void {
    this.editableVehicleTechRecord$
      .pipe(
        map(data => cloneDeep(data ?? vehicleTechRecord)),
        take(1)
      )
      .subscribe(data => {
        if (data) {
          data.techRecord[0].reasonForCreation = '';
          this.updateEditingTechRecord(data);
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

  get vehicleTechRecords$(): Observable<VehicleTechRecordModel[]> {
    return this.store.pipe(select(vehicleTechRecords));
  }

  get editableTechRecord$(): Observable<TechRecordModel | undefined> {
    return this.store.pipe(select(editableTechRecord));
  }

  get editableVehicleTechRecord$(): Observable<VehicleTechRecordModel | undefined> {
    return this.store.pipe(select(editableVehicleTechRecord));
  }

  get selectedVehicleTechRecord$(): Observable<VehicleTechRecordModel | undefined> {
    return this.store.pipe(select(selectVehicleTechnicalRecordsBySystemNumber));
  }

  get techRecord$(): Observable<TechRecordModel | undefined> {
    return this.viewableTechRecord$;
  }

  get searchResults$(): Observable<SearchResult[] | undefined> {
    return this.store.pipe(select(selectTechRecordSearchResults));
  }

  get searchResultsWithUniqueSystemNumbers$(): Observable<SearchResult[] | undefined> {
    return this.store.pipe(select(selectTechRecordSearchResultsBySystemNumber));
  }
  get viewableRecordStatus$(): Observable<StatusCodes | undefined> {
    return this.viewableTechRecord$.pipe(map(techRecord => techRecord?.statusCode));
  }

  get sectionStates$(): Observable<(string | number)[] | undefined> {
    return this.store.pipe(select(selectSectionState));
  }
  clearSectionTemplateStates() {
    this.store.dispatch(clearAllSectionStates());
  }
}
