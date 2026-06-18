import {
	DefectCategoryReferenceDataSchema,
	DefectDeficiencyReferenceDataSchema,
	DefectItemReferenceDataSchema,
} from '@dvsa/cvs-type-definitions/types/v1/defect-category-reference-data';
import { VehicleType } from '@dvsa/cvs-type-definitions/types/v1/test-result';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { createSelector } from '@ngrx/store';
import cloneDeep from 'lodash.clonedeep';
import { Deficiency } from '../../models/defects/deficiency.model';
import { defectsAdapter, defectsFeatureState } from './defects.reducer';

const { selectAll } = defectsAdapter.getSelectors();

export const defects = createSelector(defectsFeatureState, (state) => selectAll(state));

export const filteredDefects = (type: VehicleType) =>
	createSelector(defects, (defectList) => {
		const filtered = cloneDeep(defectList)
			.filter((defect) => defect.forVehicleType.includes(type))
			.map((defect) => ({
				...defect,
				items: defect.items
					.filter((item) => item.forVehicleType?.includes(type))
					.map((item) => ({
						...item,
						deficiencies: item.deficiencies?.filter((deficiency) => deficiency.forVehicleType.includes(type)),
					})),
			}));

		return filtered as DefectCategoryReferenceDataSchema[];
	});

export const selectByImNumber = (imNumber: number, vehicleType: VehicleType) =>
	createSelector(filteredDefects(vehicleType), (defectsList) =>
		defectsList.find((defect) => defect.imNumber === imNumber)
	);

export const selectByDeficiencyRef = (deficiencyRef: string, vehicleType: VehicleType) =>
	createSelector(filteredDefects(vehicleType), (defectsList) => {
		const deRef = deficiencyRef.split('.');
		const isAdvisory: boolean = deRef[2] === 'advisory';
		let defect: DefectCategoryReferenceDataSchema | undefined;
		let item: DefectItemReferenceDataSchema | undefined;
		let deficiency: DefectDeficiencyReferenceDataSchema | undefined;

		if (deRef) {
			defect = defectsList.find((d) => d.imNumber === +deRef[0]);
			const items = defect?.items.filter((i) => i.itemNumber === +deRef[1]);

			if (!isAdvisory) {
				items?.forEach((itm) => {
					const defRef = itm.deficiencies?.find((d) => d.ref === deficiencyRef);
					if (defRef) {
						item = itm;
						deficiency = defRef;
					}
				});
			}

			if (!deficiency && isAdvisory && deRef[3]) {
				item = items?.[+deRef[3]];
			} else {
				item ??= defect?.items.find((i) => i.itemNumber === +deRef[1]);
			}
		}

		return [defect, item, deficiency] as [DefectCategoryReferenceDataSchema, DefectItemReferenceDataSchema, Deficiency];
	});

export const psvDefects = filteredDefects(VehicleTypes.PSV);

export const hgvDefects = filteredDefects(VehicleTypes.HGV);

export const trlDefects = filteredDefects(VehicleTypes.TRL);

export const defect = (id: string) => createSelector(defectsFeatureState, (state) => state.entities[`${id}`]);

export const defectsLoadingState = createSelector(defectsFeatureState, (state) => state.loading);
