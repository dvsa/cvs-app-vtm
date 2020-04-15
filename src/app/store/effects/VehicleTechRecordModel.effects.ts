import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import {
  CreateVehicleTechRecord,
  EVehicleTechRecordActions,
  GetVehicleTechRecordHavingStatusAll,
  GetVehicleTechRecordHavingStatusAllSuccess,
  SetSelectedVehicleTechnicalRecord,
  SetSelectedVehicleTechRecordSuccess,
  SetVehicleTechRecordOnCreate,
  SetViewState,
  UpdateVehicleTechRecord,
  UpdateVehicleTechRecordSuccess
} from '@app/store/actions/VehicleTechRecordModel.actions';
import { GetVehicleTestResultModel } from '../actions/VehicleTestResultModel.actions';
import { TechnicalRecordService } from '@app/technical-record-search/technical-record.service';
import { VehicleTechRecordState } from '../state/VehicleTechRecordModel.state';
import { SetErrorMessage } from '../actions/Error.actions';
import {
  CREATE_PAGE_LABELS,
  VEHICLE_TECH_RECORD_SEARCH_ERRORS,
  VIEW_STATE,
  RECORD_STATUS,
  VEHICLE_TYPES
} from '@app/app.enums';
import { getSelectedVehicleTechRecord } from '../selectors/VehicleTechRecordModel.selectors';
import {
  VehicleTechRecordModel,
  VehicleIdentifiers,
  VehicleTechRecordEdit
} from '@app/models/vehicle-tech-record.model';
import { TechRecord } from '@app/models/tech-record.model';
import { SearchParams } from '@app/models/search-params';
import { UserService } from '@app/app-user.service';
import { VrmModel } from '@app/models/vrm.model';

@Injectable()
export class VehicleTechRecordModelEffects {
  @Effect()
  getTechnicalRecords$ = this.actions$.pipe(
    ofType<GetVehicleTechRecordHavingStatusAll>(
      EVehicleTechRecordActions.GetVehicleTechRecordHavingStatusAll
    ),
    map((action) => action.payload),
    switchMap((searchParams: SearchParams) =>
      this.technicalRecordService
        .getTechnicalRecordsAllStatuses(
          searchParams.searchIdentifier,
          searchParams.searchCriteria
        )
        .pipe(
          switchMap((vTechRecords: VehicleTechRecordModel[]) =>
            of(new GetVehicleTechRecordHavingStatusAllSuccess(vTechRecords))
          ),
          tap(({ vehicleTechRecords }) => {
            if (vehicleTechRecords.length > 1) {
              this.router.navigate(['/multiple-records']);
            } else {
              this.store.dispatch(
                new SetSelectedVehicleTechnicalRecord({
                  vehicleRecord: vehicleTechRecords[0],
                  viewState: VIEW_STATE.VIEW_ONLY
                })
              );
            }
          }),
          catchError((error) => {
            const errorMessage = this.getSearchResultError(error);
            return [new SetErrorMessage([errorMessage])];
          })
        )
    )
  );

  @Effect()
  setSelectedVehicleTechRecord$ = this.actions$.pipe(
    ofType<SetSelectedVehicleTechnicalRecord>(
      EVehicleTechRecordActions.SetSelectedVehicleTechnicalRecord
    ),
    switchMap(({ vehicleRecordState }) => {
      const { vehicleRecord, viewState } = vehicleRecordState;
      const actions = [];

      actions.push(
        ...[new SetSelectedVehicleTechRecordSuccess(vehicleRecord), new SetViewState(viewState)]
      );

      if (vehicleRecord.systemNumber) {
        actions.push(new GetVehicleTestResultModel(vehicleRecord.systemNumber));
      }

      return actions;
    }),
    tap(() => this.router.navigate(['/technical-record']))
  );

  @Effect({ dispatch: false })
  setVinOnCreate$ = this.actions$.pipe(
    ofType<SetVehicleTechRecordOnCreate>(EVehicleTechRecordActions.SetVehicleTechRecordOnCreate),
    map((action) => action.payload),
    switchMap((payload) => {
      let requests: Observable<any>[] = [];
      const requestErrors = [];

      requests.push(
        this.technicalRecordService
          .getTechnicalRecordsAllStatuses(payload.vin, 'all')
          .pipe(catchError((error) => of(undefined)))
      );

      if (payload.vType === 'PSV' || payload.vType === 'HGV') {
        requests.push(
          this.technicalRecordService
            .getTechnicalRecordsAllStatuses(payload.vrm, 'all')
            .pipe(catchError((error) => of(undefined)))
        );
      }

      forkJoin(requests).subscribe(([res1, res2]) => {
        if (res1) {
          requestErrors.push(CREATE_PAGE_LABELS.CREATE_VIN_LABEL_ERROR);
        }
        if (res2) {
          requestErrors.push(CREATE_PAGE_LABELS.CREATE_VRM_LABEL_ERROR);
        }
        if (!res1 && !res2) {
          const vehicleRecord = this.getVehicleTechRecordOnCreate({
            vin: payload.vin,
            vrm: payload.vrm,
            vType: payload.vType
          });
          this.store.dispatch(
            new SetSelectedVehicleTechnicalRecord({
              vehicleRecord,
              viewState: VIEW_STATE.CREATE
            })
          );
        }
        requests = [];
        if (requestErrors.length > 0) {
          this.store.dispatch(new SetErrorMessage(requestErrors));
        }
      });

      return of(payload);
    })
  );

  @Effect()
  createTechnicalRecord$ = this.actions$.pipe(
    ofType<CreateVehicleTechRecord>(EVehicleTechRecordActions.CreateVehicleTechRecord),
    switchMap(({ vehicleRecordEdit }) => {
      // **************************************
      // TODO: data should be coming from Store. Retrieve via the selector
      vehicleRecordEdit.msUserDetails = { ...this.loggedUser.getUser() };

      return this.technicalRecordService.createTechnicalRecord(vehicleRecordEdit).pipe(
        map(
          () =>
            new GetVehicleTechRecordHavingStatusAll({
              searchIdentifier: vehicleRecordEdit.vin,
              searchCriteria: 'all'
            })
        ),
        catchError(({ error }) => {
          const errorMessages = error.errors;
          return [new SetErrorMessage(errorMessages)];
        })
      );
    })
  );

  @Effect()
  updateTechnicalRecords$ = this.actions$.pipe(
    ofType<UpdateVehicleTechRecord>(EVehicleTechRecordActions.UpdateVehicleTechRecord),
    withLatestFrom(this.store.select(getSelectedVehicleTechRecord)),
    switchMap(
      ([{ vehicleRecordEdit }, vehicleTechRecord]: [
        { vehicleRecordEdit: VehicleTechRecordEdit },
        VehicleTechRecordModel
      ]) => {
        // TODO: data should be coming from Store. Retrieve via the selector
        vehicleRecordEdit.msUserDetails = { ...this.loggedUser.getUser() };

        return this.technicalRecordService
          .updateTechnicalRecords(vehicleRecordEdit, vehicleTechRecord.systemNumber)
          .pipe(
            switchMap((updatedVehicleTechRecord: VehicleTechRecordModel) => {
              updatedVehicleTechRecord.metadata = vehicleTechRecord.metadata;
              return [
                new UpdateVehicleTechRecordSuccess(updatedVehicleTechRecord),
                new SetSelectedVehicleTechRecordSuccess(updatedVehicleTechRecord),
                new SetViewState(VIEW_STATE.VIEW_ONLY)
              ];
            }),
            catchError(({ error }) => {
              const errorMessages = error.errors;
              return [new SetErrorMessage(errorMessages)];
            })
          );
      }
    )
  );

  private getVehicleTechRecordOnCreate(identifier: VehicleIdentifiers): VehicleTechRecordModel {
    const { vin, vrm, vType } = identifier;
    return {
      vin,
      vrms: [{ vrm, isPrimary: true }] as VrmModel[],
      techRecord: [
        {
          statusCode: RECORD_STATUS.PROVISIONAL,
          vehicleType: VEHICLE_TYPES[vType]
        }
      ] as TechRecord[]
    } as VehicleTechRecordModel;
  }

  private getSearchResultError(error: any) {
    let errorMessage: string;
    switch (true) {
      case error.error === 'No resources match the search criteria.':
        errorMessage = VEHICLE_TECH_RECORD_SEARCH_ERRORS.NOT_FOUND;
        break;
      case error.error === 'The provided partial VIN returned more than one match.':
        errorMessage = VEHICLE_TECH_RECORD_SEARCH_ERRORS.MULTIPLE_FOUND;
        break;
      case error.error.error !== undefined:
        errorMessage = VEHICLE_TECH_RECORD_SEARCH_ERRORS.NO_INPUT;
        break;
      default:
        errorMessage = error.error;
    }

    return errorMessage;
  }

  constructor(
    private actions$: Actions,
    private store: Store<VehicleTechRecordState>,
    private router: Router,
    private technicalRecordService: TechnicalRecordService,
    private loggedUser: UserService
  ) {}
}
