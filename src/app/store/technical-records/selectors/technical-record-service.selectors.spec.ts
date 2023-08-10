import { V3TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { createMock } from 'ts-auto-mock';
import { initialState, TechnicalRecordServiceState } from '../reducers/technical-record-service.reducer';
import {
  getSingleVehicleType,
  technicalRecordsLoadingState,
  techRecord,
  selectSectionState,
  editingTechRecord,
  selectTechRecordHistory,
  selectTechRecord
} from './technical-record-service.selectors';
import { selectRouteDataProperty } from '@store/router/selectors/router.selectors';
import { RouterService } from '@services/router/router.service';

const mockRouterService = {
  getRouteNestedParam$: () => '1',
  getRouteDataProperty$: () => false
};

describe('Tech Record Selectors', () => {
  describe('selectedTestResultState', () => {
    it('should return vehicleTechRecords state', () => {
      const state: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecord: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' }
      };
      const selectedState = techRecord.projector(state);
      expect(selectedState).toEqual(state.vehicleTechRecord);
    });
  });

  describe('technicalRecordsLoadingState', () => {
    it('should return loading state', () => {
      const state: TechnicalRecordServiceState = { ...initialState, loading: true };
      const selectedState = technicalRecordsLoadingState.projector(state);
      expect(selectedState).toBeTruthy();
    });
  });
  describe('editingTechRecord', () => {
    it('should return editingTechRecords state', () => {
      const state: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecord: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' },
        editingTechRecord: { systemNumber: 'bar', createdTimestamp: 'foo', vin: 'testVin2' }
      };
      const selectedState = editingTechRecord.projector(state);
      expect(selectedState).toEqual(state.editingTechRecord);
    });
  });

  describe('selectTechRecord', () => {
    const routes = [
      {
        statusExpected: 'provisional',
        techRecord_createdAt: undefined,
        isEditing: false,
        vehicle: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', techRecord_statusCode: 'provisional' }
      },
      {
        statusExpected: 'provisional',
        techRecord_createdAt: undefined,
        isEditing: false,
        vehicle: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', techRecord_statusCode: 'provisional' }
      },
      {
        statusExpected: 'archived',
        techRecord_createdAt: new Date('2022-02-14').getTime(),
        isEditing: false,
        vehicle: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', techRecord_statusCode: 'archived' }
      },
      {
        statusExpected: 'current',
        techRecord_createdAt: undefined,
        isEditing: true,
        vehicle: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', techRecord_statusCode: 'provisional' }
      }
    ];
    beforeEach(() => {});
    it.each(routes)('should return the $statusExpected record', ({ statusExpected, techRecord_createdAt, isEditing, vehicle }) => {
      const techRecord = selectTechRecord.projector(vehicle as unknown as V3TechRecordModel, isEditing, {
        systemNumber: 'foo',
        createdTimestamp: 'bar',
        vin: 'testVin',
        techRecord_statusCode: 'current'
      });
      expect(techRecord).toBeDefined();
      expect(techRecord?.techRecord_statusCode).toBe(statusExpected);
      // techRecord_createdAt && techRecord && expect(new Date(techRecord.techRecord_createdAt).getTime()).toBe(techRecord_createdAt);
    });
  });

  describe('getSingleVehicleType', () => {
    it('should return the correct vehicle type', () => {
      const vehicleTechRecord = {
        systemNumber: 'foo',
        createdTimestamp: 'bar',
        vin: 'testVin',
        techRecord_vehicleType: 'foobar'
      } as unknown as V3TechRecordModel;
      const state: TechnicalRecordServiceState = { ...initialState, vehicleTechRecord: vehicleTechRecord };
      const selectedVehicleType = getSingleVehicleType.projector(state);
      expect(selectedVehicleType).toBe(vehicleTechRecord.techRecord_vehicleType);
    });
  });

  describe('techRecordHistory', () => {
    it('should return the vehicles tech record history', () => {
      const vehicleTechRecords = [
        { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' },
        { systemNumber: 'bar', createdTimestamp: 'foo', vin: 'testVin2' }
      ];
      const state: TechnicalRecordServiceState = { ...initialState, techRecordHistory: vehicleTechRecords };
      const selectedVehicleHistory = selectTechRecordHistory.projector(state);
      expect(selectedVehicleHistory).toBe(vehicleTechRecords);
    });
  });

  describe('selectSectionState', () => {
    it('should return the sectionState in the technical record state', () => {
      const state: TechnicalRecordServiceState = { ...initialState, sectionState: ['TestSection1', 'TestSection2'] };
      const selectedState = selectSectionState.projector(state);
      expect(selectedState?.length).toEqual(2);
    });
  });
});
