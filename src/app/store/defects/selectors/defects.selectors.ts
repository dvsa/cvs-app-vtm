import { Defect } from '@models/defects/defect.model';
import { Deficiency } from '@models/defects/deficiency.model';
import { Item } from '@models/defects/item.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { createSelector } from '@ngrx/store';
import cloneDeep from 'lodash.clonedeep';
import { defectsAdapter, defectsFeatureState } from '../reducers/defects.reducer';

const { selectAll } = defectsAdapter.getSelectors();

export const defects = createSelector(defectsFeatureState, (state) => selectAll(state));

export const filteredDefects = (type: VehicleTypes) =>
	createSelector(defects, (defectList) => {
		return cloneDeep(defectList)
			.filter((defect) => defect.forVehicleType.includes(type))
			.map((defect) => ({
				...defect,
				items: defect.items
					.filter((item) => item.forVehicleType.includes(type))
					.map((item) => ({
						...item,
						deficiencies: item.deficiencies.filter((deficiency) => deficiency.forVehicleType.includes(type)),
					})),
			}));
	});

export const selectByImNumber = (imNumber: number, vehicleType: VehicleTypes) =>
	createSelector(filteredDefects(vehicleType), (defectsList) =>
		defectsList.find((defect) => defect.imNumber === imNumber)
	);

export const selectByDeficiencyRef = (deficiencyRef: string, vehicleType: VehicleTypes) =>
	createSelector(filteredDefects(vehicleType), (defectsList) => {
		const deRef = deficiencyRef.split('.');
		const isAdvisory: boolean = deRef[2] === 'advisory';
		let defect: Defect | undefined;
		let item: Item | undefined;
		let deficiency: Deficiency | undefined;

		if (deRef) {
			defect = defectsList.find((d) => d.imNumber === +deRef[0]);
			const items = defect?.items.filter((i) => i.itemNumber === +deRef[1]);

			// eslint-disable-next-line @typescript-eslint/no-unused-expressions, no-unused-expressions
			!isAdvisory &&
				items?.forEach((itm) => {
					const defRef: Deficiency | undefined = itm.deficiencies.find((d) => d.ref === deficiencyRef);
					if (defRef) {
						item = itm;
						deficiency = defRef;
					}
				});

			if (!deficiency && isAdvisory && deRef[3]) {
				item = items?.[+deRef[3]];
			} else {
				item = defect?.items.find((i) => i.itemNumber === +deRef[1]);
			}
		}

		return [defect, item, deficiency];
	});

export const psvDefects = filteredDefects(VehicleTypes.PSV);

export const hgvDefects = filteredDefects(VehicleTypes.HGV);

export const trlDefects = filteredDefects(VehicleTypes.TRL);

export const defect = (id: string) => createSelector(defectsFeatureState, (state) => state.entities[`${id}`]);

export const defectsLoadingState = createSelector(defectsFeatureState, (state) => state.loading);
