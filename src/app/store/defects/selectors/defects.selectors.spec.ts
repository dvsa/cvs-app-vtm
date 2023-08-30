import { Defect } from '@models/defects/defect.model';
import { deficiencyCategory } from '@models/defects/deficiency-category.enum';
import { Deficiency } from '@models/defects/deficiency.model';
import { Item } from '@models/defects/item.model';
import { VehicleTypes } from '@models/vehicle-tech-record.model';
import { DefectsState, initialDefectsState } from '../reducers/defects.reducer';
import { defect, defects, defectsLoadingState, selectByDeficiencyRef, selectByImNumber } from './defects.selectors';

describe('Defects Selectors', () => {
  describe('adapter selectors', () => {
    it('should return correct state', () => {
      const state = { ...initialDefectsState, ids: [1], entities: { [1]: { preparerId: 2 } } } as unknown as DefectsState;

      expect(defects.projector(state)).toEqual([{ preparerId: 2 }]);
      expect(defect('1').projector(state)).toEqual({ preparerId: 2 });
    });
  });

  describe('testStationsLoadingState', () => {
    it('should return loading state', () => {
      const state: DefectsState = { ...initialDefectsState, loading: true };
      const selectedState = defectsLoadingState.projector(state);
      expect(selectedState).toBeTruthy();
    });
  });

  describe('should return correct state', () => {
    const deficiency: Deficiency = {
      deficiencyCategory: deficiencyCategory.Major,
      deficiencyId: 'a',
      deficiencySubId: '',
      deficiencyText: 'missing.',
      forVehicleType: [VehicleTypes.PSV],
      ref: '1.1.a',
      stdForProhibition: false
    };

    const item: Item = {
      deficiencies: [deficiency],
      forVehicleType: [VehicleTypes.PSV],
      itemDescription: 'A registration plate:',
      itemNumber: 1
    };

    const defect: Defect = {
      additionalInfo: {
        [VehicleTypes.PSV]: {
          location: {
            longitudinal: ['front', 'rear']
          },
          notes: false
        }
      },
      forVehicleType: [VehicleTypes.PSV],
      imDescription: 'Registration Plate',
      imNumber: 1,
      items: [item]
    };
    const defect2: Defect = {
      additionalInfo: {
        [VehicleTypes.PSV]: {
          location: {
            longitudinal: ['front', 'rear']
          },
          notes: false
        }
      },
      forVehicleType: [VehicleTypes.PSV],
      imDescription: 'Registration Plate',
      imNumber: 2,
      items: [item]
    };

    const defects: Defect[] = [defect, defect2];

    it('should return filtered defect by IM number', () => {
      const selectedState = selectByImNumber(2, VehicleTypes.PSV).projector(defects);
      expect(selectedState).toEqual(defect2);
    });

    it('should return filtered defect by deficiency ref', () => {
      const selectedState = selectByDeficiencyRef('1.1.a', VehicleTypes.PSV).projector(defects);
      expect(selectedState).toEqual([defect, item, deficiency]);
    });
  });
});
