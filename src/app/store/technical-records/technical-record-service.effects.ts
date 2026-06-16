import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleType } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { EUVehicleCategory as EUVehicleCategoryCAR } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryCar.enum.js';
import { EUVehicleCategory as EUVehicleCategoryLGV } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryLgv.enum.js';
import { EUVehicleCategory as EUVehicleCategoryTRL } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryTrl.enum.js';
import { VehicleClassDescription } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/vehicleClassDescription.enum.js';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store, select } from '@ngrx/store';
import { BatchTechnicalRecordService } from '@services/batch-technical-record/batch-technical-record.service';
import { HttpService } from '@services/http/http.service';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';
import { UserService } from '@services/user-service/user-service';
import { State } from '@store/index';
import { cloneDeep } from 'lodash';
import { catchError, concatMap, filter, map, mergeMap, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { selectMergedRouteUrl } from '../router/router.selectors';
import {
	amendVin,
	amendVinSuccess,
	amendVrm,
	amendVrmFailure,
	amendVrmSuccess,
	archiveTechRecord,
	archiveTechRecordFailure,
	archiveTechRecordSuccess,
	changeVehicleType,
	clearAllSectionStates,
	clearScrollPosition,
	createVehicle,
	createVehicleRecord,
	createVehicleRecordFailure,
	createVehicleRecordSuccess,
	generateADRCertificate,
	generateADRCertificateFailure,
	generateADRCertificateSuccess,
	generateLetter,
	generateLetterFailure,
	generateLetterSuccess,
	generatePlate,
	generatePlateFailure,
	generatePlateSuccess,
	getBySystemNumber,
	getBySystemNumberFailure,
	getBySystemNumberSuccess,
	getTechRecordV3,
	getTechRecordV3Failure,
	getTechRecordV3Success,
	promoteTechRecord,
	promoteTechRecordFailure,
	promoteTechRecordSuccess,
	unarchiveTechRecord,
	unarchiveTechRecordFailure,
	unarchiveTechRecordSuccess,
	updateTechRecord,
	updateTechRecordFailure,
	updateTechRecordSuccess,
} from './technical-record-service.actions';
import { editingTechRecord, selectTechRecord, techRecord } from './technical-record-service.selectors';

@Injectable()
export class TechnicalRecordServiceEffects {
	private actions$ = inject(Actions);
	private httpService = inject(HttpService);
	private technicalRecordService = inject(TechnicalRecordService);
	private batchTechRecordService = inject(BatchTechnicalRecordService);
	private userService = inject(UserService);
	private store = inject<Store<State>>(Store);
	private router = inject(Router);

	getTechnicalRecordHistory$ = createEffect(() =>
		this.actions$.pipe(
			ofType(getBySystemNumber),
			mergeMap((action) => {
				const anchorLink = 'search-term';
				return this.httpService.searchTechRecordBySystemNumber(action.systemNumber).pipe(
					map((vehicleTechRecords) => getBySystemNumberSuccess({ techRecordHistory: vehicleTechRecords })),
					catchError(() =>
						of(getBySystemNumberFailure({ error: 'could not find technical record history', anchorLink }))
					)
				);
			})
		)
	);

	getTechRecordV3$ = createEffect(() =>
		this.actions$.pipe(
			ofType(getTechRecordV3),
			mergeMap((action) => {
				const anchorLink = 'search-term';

				return this.httpService.getTechRecordV3(action.systemNumber, action.createdTimestamp).pipe(
					map((vehicleTechRecord) => {
						return getTechRecordV3Success({ vehicleTechRecord });
					}),
					catchError((error) =>
						of(
							getTechRecordV3Failure({
								error: this.getTechRecordErrorMessage(error, 'getTechnicalRecords', 'systemNumber'),
								anchorLink,
							})
						)
					)
				);
			})
		)
	);

	createVehicleRecord$ = createEffect(() =>
		this.actions$.pipe(
			ofType(createVehicleRecord),
			withLatestFrom(this.batchTechRecordService.applicationId$, this.userService.name$, this.userService.id$),
			concatMap(([{ vehicle }, applicationId]) => {
				const vehicleRecord = { ...vehicle, techRecord_applicationId: applicationId };

				return this.httpService.createTechRecord(vehicleRecord).pipe(
					map((response) => createVehicleRecordSuccess({ vehicleTechRecord: response })),
					catchError((error) =>
						of(
							createVehicleRecordFailure({
								error: `Unable to create vehicle with VIN ${vehicle.vin}${
									error.error?.errors
										? ` because:${(error.error.errors?.map((e: string) => `\n${e}`) as string[]).join()}`
										: ''
								}`,
							})
						)
					)
				);
			})
		)
	);

	updateTechRecord$ = createEffect(() =>
		this.actions$.pipe(
			ofType(updateTechRecord),
			withLatestFrom(this.store.pipe(select(editingTechRecord))),
			concatMap(([{ systemNumber, createdTimestamp, groupType }, techRecord]) => {
				if (!techRecord) {
					return of(updateTechRecordFailure({ error: 'There is not technical record in edit' }));
				}
				return this.httpService.updateTechRecord(systemNumber, createdTimestamp, techRecord).pipe(
					map((vehicleTechRecord) => updateTechRecordSuccess({ vehicleTechRecord, groupType })),
					catchError((error) =>
						of(updateTechRecordFailure({ error: this.getTechRecordErrorMessage(error, 'updateTechnicalRecord') }))
					)
				);
			})
		)
	);

	updateSingleTechRecordSuccess = createEffect(() =>
		this.actions$.pipe(
			ofType(updateTechRecordSuccess),
			filter(({ groupType }) => groupType !== 'batch'),
			tap(({ vehicleTechRecord }) => {
				this.router.navigate(
					[`/tech-records/${vehicleTechRecord.systemNumber}/${vehicleTechRecord.createdTimestamp}`],
					{
						queryParams: { from: 'amend' },
						queryParamsHandling: 'merge',
					}
				);
			}),
			switchMap(({ vehicleTechRecord }) => [
				clearAllSectionStates(),
				clearScrollPosition(),
				getBySystemNumber({ systemNumber: vehicleTechRecord.systemNumber }),
			])
		)
	);

	amendVrm$ = createEffect(() =>
		this.actions$.pipe(
			ofType(amendVrm),
			switchMap(({ newVrm, cherishedTransfer, systemNumber, createdTimestamp, thirdMark }) => {
				return this.httpService
					.amendTechRecordVrm(newVrm, cherishedTransfer, systemNumber, createdTimestamp, thirdMark)
					.pipe(
						map((vehicleTechRecord) => amendVrmSuccess({ vehicleTechRecord })),
						catchError((error) =>
							of(amendVrmFailure({ error: this.getTechRecordErrorMessage(error, 'updateTechnicalRecord') }))
						)
					);
			})
		)
	);

	amendVin$ = createEffect(() =>
		this.actions$.pipe(
			ofType(amendVin),
			switchMap(({ newVin, systemNumber, createdTimestamp }) => {
				return this.httpService.amendTechRecordVin(newVin, systemNumber, createdTimestamp).pipe(
					map((vehicleTechRecord) => amendVinSuccess({ vehicleTechRecord })),
					catchError((error) =>
						of(amendVrmFailure({ error: this.getTechRecordErrorMessage(error, 'updateTechnicalRecord') }))
					)
				);
			})
		)
	);

	archiveTechRecord$ = createEffect(() =>
		this.actions$.pipe(
			ofType(archiveTechRecord),
			switchMap(({ systemNumber, createdTimestamp, reasonForArchiving }) =>
				this.httpService.archiveTechRecord(systemNumber, createdTimestamp, reasonForArchiving).pipe(
					map((vehicleTechRecord) => archiveTechRecordSuccess({ vehicleTechRecord })),
					catchError((error) =>
						of(archiveTechRecordFailure({ error: this.getTechRecordErrorMessage(error, 'archiveTechRecord') }))
					)
				)
			)
		)
	);

	promoteTechRecord$ = createEffect(() =>
		this.actions$.pipe(
			ofType(promoteTechRecord),
			switchMap(({ systemNumber, createdTimestamp, reasonForPromoting }) =>
				this.httpService.promoteTechRecord(systemNumber, createdTimestamp, reasonForPromoting).pipe(
					map((vehicleTechRecord) => promoteTechRecordSuccess({ vehicleTechRecord })),
					catchError((error) =>
						of(promoteTechRecordFailure({ error: this.getTechRecordErrorMessage(error, 'promoteTechRecord') }))
					)
				)
			)
		)
	);

	generateTechRecordBasedOnSectionTemplates$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(createVehicle),
				withLatestFrom(this.store.pipe(select(editingTechRecord))),
				tap(([{ techRecord_vehicleType }, editableTechRecord]) => {
					const techRecord = { ...cloneDeep(editableTechRecord), techRecord_vehicleType } as TechRecordType<'put'>;

					if (techRecord.techRecord_vehicleType === VehicleTypes.CAR) {
						techRecord.techRecord_euVehicleCategory = EUVehicleCategoryCAR.M1;
					}

					if (techRecord.techRecord_vehicleType === VehicleTypes.LGV) {
						techRecord.techRecord_euVehicleCategory = EUVehicleCategoryLGV.N1;
					}

					this.technicalRecordService.updateEditingTechRecord(techRecord);
				})
			),
		{ dispatch: false }
	);

	generateTechRecordBasedOnSectionTemplatesAfterVehicleTypeChange$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(changeVehicleType),
				concatLatestFrom(() => [this.store.pipe(select(editingTechRecord)), this.store.pipe(select(techRecord))]),
				concatMap(([{ techRecord_vehicleType }, editableTechRecord, viewableTechRecord]) => {
					const techRecord = { ...cloneDeep(editableTechRecord) } as TechRecordType<'get'>;
					techRecord.techRecord_vehicleType = techRecord_vehicleType as VehicleType;

					if (viewableTechRecord) {
						techRecord.vin = viewableTechRecord.vin;
						techRecord.partialVin = viewableTechRecord.partialVin;
						techRecord.systemNumber = viewableTechRecord.systemNumber;
						techRecord.createdTimestamp = viewableTechRecord.createdTimestamp;
						techRecord.techRecord_statusCode = viewableTechRecord.techRecord_statusCode;
						techRecord.techRecord_hiddenInVta = viewableTechRecord.techRecord_hiddenInVta;
						techRecord.techRecord_recordCompleteness = viewableTechRecord.techRecord_recordCompleteness;

						if ('primaryVrm' in viewableTechRecord && techRecord.techRecord_vehicleType !== VehicleTypes.TRL) {
							techRecord.primaryVrm = viewableTechRecord.primaryVrm;
							techRecord.secondaryVrms = viewableTechRecord.secondaryVrms;
						}

						if ('trailerId' in viewableTechRecord && techRecord.techRecord_vehicleType === VehicleTypes.TRL) {
							techRecord.trailerId = viewableTechRecord.trailerId;
						}
					}

					if (techRecord.techRecord_vehicleType === VehicleTypes.TRL) {
						techRecord.techRecord_vehicleType = VehicleTypes.TRL;
						techRecord.techRecord_euVehicleCategory = EUVehicleCategoryTRL.O1;
					}

					if (
						techRecord.techRecord_vehicleType === VehicleTypes.HGV ||
						techRecord.techRecord_vehicleType === VehicleTypes.PSV
					) {
						techRecord.techRecord_approvalType = null;
						techRecord.techRecord_vehicleConfiguration = null;
					}

					if (techRecord.techRecord_vehicleType === VehicleTypes.HGV) {
						techRecord.techRecord_vehicleClass_description = VehicleClassDescription.HeavyGoodsVehicle;
					}

					if (techRecord.techRecord_vehicleType === VehicleTypes.TRL) {
						techRecord.techRecord_vehicleClass_description = VehicleClassDescription.Trailer;
						techRecord.techRecord_euVehicleCategory = null;
					}

					if (
						techRecord.techRecord_vehicleType === VehicleTypes.CAR &&
						techRecord.techRecord_euVehicleCategory !== EUVehicleCategoryCAR.M1
					) {
						techRecord.techRecord_euVehicleCategory = EUVehicleCategoryCAR.M1;
					}

					if (
						techRecord.techRecord_vehicleType === VehicleTypes.LGV &&
						techRecord.techRecord_euVehicleCategory !== EUVehicleCategoryLGV.N1
					) {
						techRecord.techRecord_euVehicleCategory = EUVehicleCategoryLGV.N1;
					}

					return of(techRecord);
				}),
				tap((techRecord) => this.technicalRecordService.updateEditingTechRecord(techRecord as TechRecordType<'put'>))
			),
		{ dispatch: false }
	);

	generatePlate$ = createEffect(() =>
		this.actions$.pipe(
			ofType(generatePlate),
			withLatestFrom(this.store.select(selectTechRecord), this.userService.name$, this.userService.userEmail$),
			switchMap(([{ reason }, vehicle, name, email]) =>
				this.httpService.generatePlate(vehicle as TechRecordType<'get'>, reason, { name, email }).pipe(
					map(() => generatePlateSuccess()),
					catchError((error) =>
						of(generatePlateFailure({ error: this.getTechRecordErrorMessage(error, 'generatePlate') }))
					)
				)
			)
		)
	);

	generateLetter$ = createEffect(() =>
		this.actions$.pipe(
			ofType(generateLetter),
			withLatestFrom(this.store.select(selectTechRecord), this.userService.name$, this.userService.userEmail$),
			switchMap(([{ letterType, paragraphId }, vehicle, name, email]) =>
				this.httpService
					.generateLetter(vehicle as TechRecordType<'get'>, letterType, paragraphId, { name, email })
					.pipe(
						map(() => generateLetterSuccess()),
						catchError((error) =>
							of(generateLetterFailure({ error: this.getTechRecordErrorMessage(error, 'generateLetter') }))
						)
					)
			)
		)
	);

	unarchiveTechRecord$ = createEffect(() =>
		this.actions$.pipe(
			ofType(unarchiveTechRecord),
			switchMap(({ systemNumber, createdTimestamp, reasonForUnarchiving, status }) =>
				this.httpService.unarchiveTechRecord(systemNumber, createdTimestamp, reasonForUnarchiving, status).pipe(
					map((vehicleTechRecord) => unarchiveTechRecordSuccess({ vehicleTechRecord })),
					catchError((error) =>
						of(unarchiveTechRecordFailure({ error: this.getTechRecordErrorMessage(error, 'unarchiveTechRecord') }))
					)
				)
			)
		)
	);

	generateADRCertificate$ = createEffect(() =>
		this.actions$.pipe(
			ofType(generateADRCertificate),
			switchMap(({ systemNumber, createdTimestamp, certificateType }) =>
				this.httpService.generateADRCertificate(systemNumber, createdTimestamp, certificateType).pipe(
					map((res) => generateADRCertificateSuccess({ id: res.id })),
					catchError((error) =>
						of(
							generateADRCertificateFailure({ error: this.getTechRecordErrorMessage(error, 'generateADRCertificate') })
						)
					)
				)
			)
		)
	);

	createVehicleSuccess = createEffect(
		() =>
			this.actions$.pipe(
				ofType(createVehicleRecordSuccess),
				concatLatestFrom(() => this.store.select(selectMergedRouteUrl)),
				// only redirect to the new record details if they've come from the create page
				filter(([_, mergedRouteUrl]) => mergedRouteUrl === 'create/new-record-details'),
				tap(([{ vehicleTechRecord }]) =>
					this.router.navigate(['tech-records', vehicleTechRecord.systemNumber, vehicleTechRecord.createdTimestamp], {
						queryParams: { from: 'create' },
						queryParamsHandling: 'merge',
					})
				)
			),
		{ dispatch: false }
	);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getTechRecordErrorMessage(error: any, type: string, search?: string): string {
		if (typeof error !== 'object') {
			return error;
		}
		if (error.status === 404) {
			return this.apiErrors[`${type}_404`];
		}
		return `${this.apiErrors[`${type}_400`]} ${search ?? JSON.stringify(error.error)}`;
	}

	private apiErrors: Record<string, string> = {
		getTechnicalRecords_400: 'There was a problem getting the Tech Record by',
		getTechnicalRecords_404:
			'Vehicle not found, check the vehicle registration mark, trailer ID or vehicle identification number',
		createVehicleRecord_400: 'Unable to create a new vehicle record',
		// createProvisionalTechRecord_400: 'Unable to create a new provisional record',
		updateTechnicalRecord_400: 'Unable to update technical record',
		archiveTechRecord_400: 'Unable to archive technical record',
		promoteTechRecord_400: 'Unable to promote technical record',
		unarchiveTechRecord_400: 'Unable to unarchive technical record',
		generateADRCertificate_400: 'Unable to generate ADR certificate',
	};
}
