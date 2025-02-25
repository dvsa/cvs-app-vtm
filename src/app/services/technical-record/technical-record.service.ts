import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategoryTrl.enum.js';
import { TechRecordGETMotorcycleComplete } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/motorcycle/complete';
import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import {
	TechRecordGETHGV,
	TechRecordGETPSV,
	TechRecordGETTRL,
} from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb-vehicle-type';
import { ReferenceDataTyreLoadIndex } from '@models/reference-data.model';
import { SEARCH_TYPES } from '@models/search-types-enum';
import {
	StatusCodes,
	TechRecordModel,
	V3TechRecordModel,
	VehicleTechRecordModel,
	VehicleTypes,
} from '@models/vehicle-tech-record.model';
import { AxleTyreProperties } from '@models/vehicle/axleTyreProperties';
import { Store, select } from '@ngrx/store';
import { HttpService } from '@services/http/http.service';
import { RouterService } from '@services/router/router.service';
import { fetchSearchResult } from '@store/tech-record-search/tech-record-search.actions';
import {
	selectTechRecordSearchResults,
	selectTechRecordSearchResultsBySystemNumber,
} from '@store/tech-record-search/tech-record-search.selector';
import {
	clearAllSectionStates,
	createVehicle,
	selectSectionState,
	selectTechRecord,
	selectTechRecordHistory,
	techRecord,
	updateEditingTechRecord,
	updateEditingTechRecordCancel,
} from '@store/technical-records';
import { cloneDeep } from 'lodash';
import {
	Observable,
	catchError,
	combineLatest,
	debounceTime,
	filter,
	map,
	of,
	switchMap,
	take,
	tap,
	throwError,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TechnicalRecordService {
	private store = inject(Store);
	private httpService = inject(HttpService);
	private routerService = inject(RouterService);

	getVehicleTypeWithSmallTrl(technicalRecord: V3TechRecordModel): VehicleTypes {
		return technicalRecord.techRecord_vehicleType === VehicleTypes.TRL &&
			(technicalRecord.techRecord_euVehicleCategory === EUVehicleCategory.O1 ||
				technicalRecord.techRecord_euVehicleCategory === EUVehicleCategory.O2)
			? (VehicleTypes.SMALL_TRL as VehicleTypes)
			: (technicalRecord.techRecord_vehicleType as VehicleTypes);
	}

	getAxleFittingWeightValueFromLoadIndex(
		loadIndexValue: string,
		fitmentCodeType: AxleTyreProperties.FitmentCodeEnum | null | undefined,
		loadIndex: ReferenceDataTyreLoadIndex[] | null
	): number | undefined {
		let factor = 4;
		if (fitmentCodeType === 'single') {
			factor = 2;
		}
		const axleLoadIndex = loadIndex?.find((resource) => resource.resourceKey === loadIndexValue);
		return axleLoadIndex?.loadIndex ? +axleLoadIndex.loadIndex * factor : undefined;
	}

	isUnique(valueToCheck: string, searchType: SEARCH_TYPES): Observable<boolean> {
		return this.httpService.searchTechRecords(searchType, valueToCheck).pipe(
			map((searchResults) => {
				if (searchResults.every((result) => result.techRecord_statusCode === StatusCodes.ARCHIVED)) {
					return true;
				}

				if (searchType === SEARCH_TYPES.VRM) {
					return !searchResults.some((result) => result.primaryVrm === valueToCheck);
				}

				return false;
			}),
			catchError((error: HttpErrorResponse) => {
				return (error.status === 404 && of(true)) || throwError(() => error);
			})
		);
	}
	get techRecordHistory$(): Observable<TechRecordSearchSchema[] | undefined> {
		return this.store.pipe(select(selectTechRecordHistory));
	}

	get techRecord$(): Observable<V3TechRecordModel | undefined> {
		return combineLatest([
			this.store.pipe(select(selectTechRecord)),
			this.store.pipe(select(techRecord)),
			this.routerService.getRouteDataProperty$('isEditing'),
		]).pipe(
			tap(([technicalRecord, nonEditingTechRecord, isEditing]) => {
				if (isEditing && !technicalRecord && nonEditingTechRecord) {
					this.updateEditingTechRecord(nonEditingTechRecord as TechRecordType<'put'>);
				}
			}),
			map(([technicalRecord, nonEditingTechRecord, isEditing]) =>
				isEditing && !technicalRecord ? nonEditingTechRecord : technicalRecord
			)
		);
	}

	updateEditingTechRecord(record: TechRecordType<'put'>): void {
		if (
			record.techRecord_vehicleType === 'psv' ||
			record.techRecord_vehicleType === 'hgv' ||
			(record.techRecord_vehicleType === 'trl' &&
				record.techRecord_euVehicleCategory !== EUVehicleCategory.O1 &&
				record.techRecord_euVehicleCategory !== EUVehicleCategory.O2)
		) {
			record.techRecord_noOfAxles =
				record.techRecord_axles && record.techRecord_axles.length > 0 ? record.techRecord_axles?.length : null;
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
			record.techRecord.find((foundRecord) => foundRecord.statusCode === StatusCodes.CURRENT) ??
			record.techRecord.find((foundRecord) => foundRecord.statusCode === StatusCodes.PROVISIONAL) ??
			record.techRecord.find((foundRecord) => foundRecord.statusCode === StatusCodes.ARCHIVED)
		);
	}

	generateEditingVehicleTechnicalRecordFromVehicleType(vehicleType: VehicleTypes): void {
		this.store.dispatch(createVehicle({ techRecord_vehicleType: vehicleType }));
	}

	clearReasonForCreation(): void {
		this.techRecord$
			.pipe(
				map((data) => cloneDeep(data)),
				take(1)
			)
			.subscribe((data) => {
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
				switchMap((value) => {
					return this.isUnique(value, SEARCH_TYPES.VIN).pipe(
						map((result) => {
							if (control.value === originalVin) {
								return { validateVin: { message: 'You must provide a new VIN' } };
							}
							return result
								? null
								: {
										validateVin: {
											message: 'This VIN already exists, if you continue it will be associated with two vehicles',
										},
									};
						}),
						catchError(() => of(null))
					);
				})
			);
		};
	}

	validateVrmDoesNotExist(previousVrm: string): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			return of(control).pipe(
				filter((errorControl: AbstractControl) => !!errorControl.value),
				take(1),
				switchMap((vrmControl) => {
					return this.checkVrmNotActive(vrmControl, previousVrm);
				})
			);
		};
	}

	validateVrmForCherishedTransfer(): AsyncValidatorFn {
		return (control: AbstractControl): Observable<ValidationErrors | null> => {
			return of(control).pipe(
				filter((errorControl: AbstractControl) => !!errorControl.value),
				take(1),
				switchMap((vrmControl) => {
					const thirdMark = vrmControl.root.get('thirdMark')?.value;
					const previousVrm = vrmControl.root.get('previousVrm')?.value;
					if (thirdMark) {
						const vrmNotNew = previousVrm === vrmControl.value;
						if (vrmNotNew) return of({ validateVrm: { message: 'You must provide a new VRM' } });
						return this.httpService.searchTechRecords(SEARCH_TYPES.VRM, vrmControl.value).pipe(
							map((results) => {
								if (results.some((result) => result.techRecord_statusCode === StatusCodes.CURRENT)) {
									return null;
								}
								return { validateVrm: { message: 'This VRM does not exist on a current record' } };
							}),
							catchError((err: HttpErrorResponse) => {
								return (
									(err.status === 404 &&
										of({ validateVrm: { message: 'This VRM does not exist on a current record' } })) ||
									throwError(() => err)
								);
							})
						);
					}
					return this.checkVrmNotActive(control, previousVrm);
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
		return this.techRecord$.pipe(
			map((technicalRecord) => technicalRecord?.techRecord_statusCode as StatusCodes | undefined)
		);
	}

	get sectionStates$(): Observable<(string | number)[] | undefined> {
		return this.store.pipe(select(selectSectionState));
	}

	getMakeAndModel(technicalRecord: V3TechRecordModel): string {
		if (
			technicalRecord.techRecord_vehicleType === 'car' ||
			technicalRecord.techRecord_vehicleType === 'motorcycle' ||
			technicalRecord.techRecord_vehicleType === 'lgv'
		) {
			return '';
		}

		const make =
			(technicalRecord?.techRecord_vehicleType === 'psv'
				? technicalRecord.techRecord_chassisMake
				: technicalRecord.techRecord_make) ?? '';

		const model =
			(technicalRecord.techRecord_vehicleType === 'psv'
				? technicalRecord.techRecord_chassisModel
				: technicalRecord.techRecord_model) ?? '';

		if (!make || !model) {
			return make || model;
		}

		return `${make} - ${model}`;
	}

	clearSectionTemplateStates() {
		this.store.dispatch(clearAllSectionStates());
	}

	checkVrmNotActive(control: AbstractControl, previousVrm: string) {
		return this.httpService.searchTechRecords(SEARCH_TYPES.VRM, control.value).pipe(
			map((results) => {
				const currentRecord = results.filter((result) => result.techRecord_statusCode === StatusCodes.CURRENT);
				const provisionalRecord = results.filter((result) => result.techRecord_statusCode === StatusCodes.PROVISIONAL);

				if (control.value === previousVrm) {
					return { validateVrm: { message: 'You must provide a new VRM' } };
				}
				if (currentRecord.length > 0) {
					const value = control.value as string;
					return {
						validateVrm: {
							message: `A current technical record already exists for
              ${value} with the VIN number ${currentRecord[0].vin}.
              Please fill in the third mark field`,
						},
					};
				}
				if (provisionalRecord.length > 0) {
					return {
						validateVrm: {
							message: `This VRM already exists on a provisional record with the VIN: ${provisionalRecord[0].vin}`,
						},
					};
				}
				return null;
			}),
			catchError((err: HttpErrorResponse) => {
				return (err.status === 404 && of(null)) || throwError(() => err);
			})
		);
	}

	hasPsvGrossAxleChanged(changes: Partial<TechRecordGETPSV>): boolean {
		return [
			changes.techRecord_grossKerbWeight,
			changes.techRecord_grossDesignWeight,
			changes.techRecord_grossLadenWeight,
			changes.techRecord_grossGbWeight,
		].some(Boolean);
	}

	hasHgvGrossAxleChanged(changes: Partial<TechRecordGETHGV>): boolean {
		return [
			changes.techRecord_grossEecWeight,
			changes.techRecord_grossDesignWeight,
			changes.techRecord_grossGbWeight,
		].some(Boolean);
	}

	hasTrlGrossAxleChanged(changes: Partial<TechRecordGETTRL>): boolean {
		return [
			changes.techRecord_grossEecWeight,
			changes.techRecord_grossDesignWeight,
			changes.techRecord_grossGbWeight,
		].some(Boolean);
	}

	hasHgvTrainAxleChanged(changes: Partial<TechRecordGETHGV>): boolean {
		return [
			changes.techRecord_trainDesignWeight,
			changes.techRecord_trainGbWeight,
			changes.techRecord_trainEecWeight,
		].some(Boolean);
	}

	hasPsvTrainAxleChanged(changes: Partial<TechRecordGETPSV>): boolean {
		return [changes.techRecord_trainDesignWeight, changes.techRecord_maxTrainGbWeight].some(Boolean);
	}

	hasMaxTrainAxleChanged(changes: Partial<TechRecordGETHGV>): boolean {
		return [
			changes.techRecord_maxTrainDesignWeight,
			changes.techRecord_maxTrainEecWeight,
			changes.techRecord_maxTrainGbWeight,
		].some(Boolean);
	}

	haveAxlesChanged(vehicleType: VehicleTypes, changes: Partial<TechRecordType<'get'>>) {
		if (
			vehicleType === 'psv' &&
			(this.hasPsvGrossAxleChanged(changes as Partial<TechRecordGETPSV>) ||
				this.hasPsvTrainAxleChanged(changes as Partial<TechRecordGETPSV>))
		)
			return true;

		if (
			vehicleType === 'hgv' &&
			(this.hasHgvTrainAxleChanged(changes as Partial<TechRecordGETHGV>) ||
				this.hasMaxTrainAxleChanged(changes as Partial<TechRecordGETHGV>) ||
				this.hasHgvGrossAxleChanged(changes as Partial<TechRecordGETHGV>))
		)
			return true;

		if (vehicleType === 'trl' && this.hasTrlGrossAxleChanged(changes as Partial<TechRecordGETTRL>)) return true;

		return false;
	}

	getVehicleSize(techRecord: V3TechRecordModel) {
		return techRecord.techRecord_vehicleType === 'psv' ? techRecord.techRecord_vehicleSize : undefined;
	}

	getVehicleClassDescription(techRecord: V3TechRecordModel) {
		return techRecord.techRecord_vehicleType === 'psv' ||
			techRecord.techRecord_vehicleType === 'hgv' ||
			techRecord.techRecord_vehicleType === 'trl' ||
			techRecord.techRecord_vehicleType === 'motorcycle'
			? techRecord.techRecord_vehicleClass_description
			: undefined;
	}

	getVehicleClassCode(techRecord: V3TechRecordModel) {
		return techRecord.techRecord_vehicleType === 'motorcycle' && techRecord.techRecord_recordCompleteness === 'complete'
			? (techRecord as TechRecordGETMotorcycleComplete).techRecord_vehicleClass_code
			: undefined;
	}

	getVehicleClass(techRecord: V3TechRecordModel) {
		return this.getVehicleClassCode(techRecord) ?? this.getVehicleClassDescription(techRecord);
	}

	getVehicleSubClass(techRecord: V3TechRecordModel) {
		return techRecord.techRecord_vehicleType === 'car' || techRecord.techRecord_vehicleType === 'lgv'
			? techRecord.techRecord_vehicleSubclass
			: undefined;
	}

	searchBy(type: SEARCH_TYPES | undefined, term: string): void {
		this.store.dispatch(fetchSearchResult({ searchBy: type, term }));
	}
}
