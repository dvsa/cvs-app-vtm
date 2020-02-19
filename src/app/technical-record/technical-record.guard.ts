// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
// import { Store, select } from '@ngrx/store';
// import { Observable, of } from 'rxjs';
// import { map, take, tap, switchMap, catchError } from 'rxjs/operators';
//
// import { IAppState } from '@app/store/state/app.state';
// import { getVehicleTechRecordIdentifier } from '@app/store/selectors/VehicleTechRecordModel.selectors';
// import {
//   GetVehicleTechRecordModelHavingStatusAllSuccess,
//   GetVehicleTechRecordModelHavingStatusAllFailure
// } from '@app/store/actions/VehicleTechRecordModel.actions';
// import { TechnicalRecordService } from '@app/technical-record-search/technical-record.service';
// import { GetVehicleTestResultModel } from '@app/store/actions/VehicleTestResultModel.actions';
// import { VehicleTechRecordModel } from './../models/vehicle-tech-record.model';
// import { SetVehicleTechRecordIdentifier } from './../store/actions/VehicleTechRecordModel.actions';
//
// @Injectable({ providedIn: 'root' })
// export class TechnicalRecordGuard implements CanActivate {
//   constructor(
//     private router: Router,
//     private store: Store<IAppState>,
//     private techRecordService: TechnicalRecordService
//   ) {}
//
//   hasTechnicalRecordInStore(searchIdentifier: string): Observable<boolean> {
//     return this.store.pipe(
//       select(getVehicleTechRecordIdentifier),
//       map((techRecordIdentifier) => {
//         return techRecordIdentifier === searchIdentifier;
//       }),
//       take(1)
//     );
//   }
//
//   populateStoreWithDataFromApi(searchIdentifier: string): Observable<boolean> {
//     return this.techRecordService.getTechnicalRecordsAllStatuses(searchIdentifier, 'all').pipe(
//       // TODO: List of VehicleTechRecordModel[] is retured. Hence this will break exiting reducer implementation
//       // Fix after ADR
//       tap((vehicleRecords: VehicleTechRecordModel) => {
//         this.store.dispatch(new SetVehicleTechRecordIdentifier(vehicleRecords[0].vin));
//         this.store.dispatch(new GetVehicleTechRecordModelHavingStatusAllSuccess(vehicleRecords));
//         this.store.dispatch(new GetVehicleTestResultModel(vehicleRecords[0].systemNumber));
//       }),
//       map(Boolean),
//       catchError((error) => {
//         this.store.dispatch(new GetVehicleTechRecordModelHavingStatusAllFailure(error));
//         return of(false);
//       })
//     );
//   }
//
//   canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
//     const identifier = route.params['searchIdentifier'];
//
//     return this.hasTechnicalRecordInStore(identifier).pipe(
//       switchMap((inStore) => {
//         if (inStore) {
//           return of(inStore);
//         }
//         return this.populateStoreWithDataFromApi(identifier);
//       })
//     );
//   }
// }
//
