import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { createSelector } from '@ngrx/store';
import cloneDeep from 'lodash.clonedeep';
import { defectsAdapter, defectsFeatureState } from '../reducers/defects.reducer';

const { selectAll } = defectsAdapter.getSelectors();

export const defects = createSelector(defectsFeatureState, state => selectAll(state));

export const filteredDefects = (type: VehicleTypes) => createSelector(defects, defects => {
  return cloneDeep(defects)
    .filter(defect => defect.forVehicleType.includes(type))
    .map(defect => ({
      ...defect,
      items: defect.items
        .filter(item => item.forVehicleType.includes(type))
        .map(item => ({
          ...item,
          deficiencies: item.deficiencies.filter(deficiency => deficiency.forVehicleType.includes(type))
        }))
    }));
});

export const psvDefects = filteredDefects(VehicleTypes.PSV);

export const hgvDefects = filteredDefects(VehicleTypes.HGV);

export const trlDefects = filteredDefects(VehicleTypes.TRL);

export const defect = (id: string) => createSelector(defectsFeatureState, state => state.entities[id]);

export const defectsLoadingState = createSelector(defectsFeatureState, state => state.loading);
