import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { createSelector } from '@ngrx/store';
import cloneDeep from 'lodash.clonedeep';
import { defectsAdapter, defectsFeatureState } from '../reducers/defects.reducer';

const { selectAll } = defectsAdapter.getSelectors();

export const defects = createSelector(defectsFeatureState, state => selectAll(state));

export const filteredDefects = (type: VehicleTypes) =>
  createSelector(defects, defects => {
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

export const selectByImNumber = (imNumber: number, vehicleType: VehicleTypes) =>
  createSelector(filteredDefects(vehicleType), defects => {
    return defects.find(defect => defect.imNumber === imNumber);
  });

export const selectByDeficiencyRef = (deficiencyRef: string, vehicleType: VehicleTypes) =>
  createSelector(filteredDefects(vehicleType), defects => {
    const deRef = deficiencyRef.split('.');
    let defect, item, deficiency;
    if (deRef) {
      defect = defects.find(d => d.imNumber === +deRef[0]);
      if (defect) {
        item = defect.items.find(i => i.itemNumber === +deRef[1]);
        if (item && deRef[3]) {
          deficiency = item.deficiencies.find(d => d.ref === deficiencyRef);
        }
      }
    }
    return [defect, item, deficiency];
  });

export const psvDefects = filteredDefects(VehicleTypes.PSV);

export const hgvDefects = filteredDefects(VehicleTypes.HGV);

export const trlDefects = filteredDefects(VehicleTypes.TRL);

export const defect = (id: string) => createSelector(defectsFeatureState, state => state.entities[id]);

export const defectsLoadingState = createSelector(defectsFeatureState, state => state.loading);
