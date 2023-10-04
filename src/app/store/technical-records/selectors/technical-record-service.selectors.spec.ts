import { TechRecordSearchSchema } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { TechnicalRecordServiceState, initialState } from '../reducers/technical-record-service.reducer';
import {
  editingTechRecord,
  getSingleVehicleType,
  selectSectionState,
  selectTechRecord,
  selectTechRecordHistory,
  techRecord,
  technicalRecordsLoadingState,
} from './technical-record-service.selectors';

describe('Tech Record Selectors', () => {
  describe('selectedTestResultState', () => {
    it('should return vehicleTechRecords state', () => {
      const state: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecord: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as unknown as TechRecordType<'get'>,
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
        vehicleTechRecord: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' } as TechRecordType<'get'>,
        editingTechRecord: { systemNumber: 'bar', createdTimestamp: 'foo', vin: 'testVin2' } as unknown as TechRecordType<'put'>,
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
        vehicle: {
          systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', techRecord_statusCode: 'provisional',
        },
      },
      {
        statusExpected: 'provisional',
        techRecord_createdAt: undefined,
        isEditing: false,
        vehicle: {
          systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', techRecord_statusCode: 'provisional',
        },
      },
      {
        statusExpected: 'archived',
        techRecord_createdAt: new Date('2022-02-14').toISOString(),
        isEditing: false,
        vehicle: {
          systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', techRecord_statusCode: 'archived',
        },
      },
      {
        statusExpected: 'current',
        techRecord_createdAt: undefined,
        isEditing: true,
        vehicle: {
          systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin', techRecord_statusCode: 'provisional',
        },
      },
    ];
    beforeEach(() => {});
    it.each(routes)('should return the $statusExpected record', ({
      statusExpected, techRecord_createdAt, isEditing, vehicle,
    }) => {
      const mockTechRecord = selectTechRecord.projector({ ...vehicle, techRecord_createdAt } as unknown as TechRecordType<'get'>, isEditing, {
        systemNumber: 'foo',
        createdTimestamp: 'bar',
        vin: 'testVin',
        techRecord_statusCode: 'current',
      } as unknown as TechRecordType<'put'>);
      expect(mockTechRecord).toBeDefined();
      expect(mockTechRecord?.techRecord_statusCode).toBe(statusExpected);
      expect((mockTechRecord as TechRecordType<'get'>).techRecord_createdAt).toEqual(techRecord_createdAt);
    });
  });

  describe('getSingleVehicleType', () => {
    it('should return the correct vehicle type', () => {
      const vehicleTechRecord = {
        systemNumber: 'foo',
        createdTimestamp: 'bar',
        vin: 'testVin',
        techRecord_vehicleType: 'foobar',
      } as unknown as TechRecordType<'get'>;
      const state: TechnicalRecordServiceState = { ...initialState, vehicleTechRecord };
      const selectedVehicleType = getSingleVehicleType.projector(state);
      expect(selectedVehicleType).toBe(vehicleTechRecord.techRecord_vehicleType);
    });
  });

  describe('techRecordHistory', () => {
    it('should return the vehicles tech record history', () => {
      const vehicleTechRecords = [
        { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' },
        { systemNumber: 'bar', createdTimestamp: 'foo', vin: 'testVin2' },
      ] as TechRecordSearchSchema[];
      const state: TechnicalRecordServiceState = { ...initialState, techRecordHistory: vehicleTechRecords };
      const selectedVehicleHistory = selectTechRecordHistory.projector(state);
      expect(selectedVehicleHistory).toBe(vehicleTechRecords);
    });
  });

  describe('selectSectionState', () => {
    it('should return the sectionState in the technical record state', () => {
      const state: TechnicalRecordServiceState = { ...initialState, sectionState: ['TestSection1', 'TestSection2'] };
      const selectedState = selectSectionState.projector(state);
      expect(selectedState?.length).toBe(2);
    });
  });
});
