import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { createMock } from 'ts-auto-mock';
import { initialState, TechnicalRecordServiceState } from '../reducers/technical-record-service.reducer';
import {
  getSingleVehicleType,
  selectVehicleTechnicalRecordsBySystemNumber,
  technicalRecordsLoadingState,
  vehicleTechRecords,
  selectSectionState,
  selectNonEditingTechRecord
} from './technical-record-service.selectors';

describe('Tech Record Selectors', () => {
  describe('selectedTestResultState', () => {
    it('should return vehicleTechRecords state', () => {
      const state: TechnicalRecordServiceState = { ...initialState, vehicleTechRecord: [createMock<VehicleTechRecordModel>()] };
      const selectedState = vehicleTechRecords.projector(state);
      expect(selectedState.length).toEqual(1);
    });
  });

  describe('technicalRecordsLoadingState', () => {
    it('should return loading state', () => {
      const state: TechnicalRecordServiceState = { ...initialState, loading: true };
      const selectedState = technicalRecordsLoadingState.projector(state);
      expect(selectedState).toBeTruthy();
    });
  });

  describe(selectVehicleTechnicalRecordsBySystemNumber.name, () => {
    it('should return the correct record by vin', () => {
      const systemNumber = 'VIN0001';
      const systemNumbers = ['VIN0001', 'VIN0002', 'VIN0003'];
      const vehicleTechRecords = systemNumbers.map(
        systemNumber =>
          ({
            systemNumber,
            vin: '123',
            techRecord: [
              {
                createdAt: new Date('2022-01-01').toISOString()
              },
              {
                createdAt: new Date('2022-01-03').toISOString()
              },
              {
                createdAt: new Date('2022-01-02').toISOString()
              }
            ]
          } as unknown as VehicleTechRecordModel)
      );

      const selectedState = selectVehicleTechnicalRecordsBySystemNumber.projector(vehicleTechRecords, { systemNumber, vin: '123' });

      const expectedTechRecord = vehicleTechRecords[0].techRecord;
      expect(selectedState?.techRecord[0].createdAt).toStrictEqual(expectedTechRecord[1].createdAt);
      expect(selectedState?.techRecord[1].createdAt).toStrictEqual(expectedTechRecord[2].createdAt);
      expect(selectedState?.techRecord[2].createdAt).toStrictEqual(expectedTechRecord[0].createdAt);
    });
  });

  describe('selectTechRecord', () => {
    const routes = [
      {
        statusExpected: 'provisional',
        createdAt: undefined,
        url: 'provisional',
        vehicle: { techRecord: [{ statusCode: 'provisional' }] }
      },
      {
        statusExpected: 'provisional',
        createdAt: undefined,
        url: 'tech-records',
        vehicle: { techRecord: [{ statusCode: 'provisional' }] }
      },
      {
        statusExpected: 'current',
        createdAt: undefined,
        url: 'tech-records',
        vehicle: { techRecord: [{ statusCode: 'current' }, { statusCode: 'provisional' }] }
      },
      {
        statusExpected: 'archived',
        createdAt: new Date('2022-02-14').getTime(),
        url: 'tech-records',
        vehicle: { techRecord: [{ statusCode: 'archived', createdAt: '2022-02-14' }, { statusCode: 'provisional' }] }
      },
      {
        statusExpected: 'archived',
        createdAt: new Date('2022-12-27').getTime(),
        url: 'tech-records',
        vehicle: {
          techRecord: [
            { statusCode: 'archived', createdAt: '2022-02-14' },
            { statusCode: 'archived', createdAt: '2022-12-27' }
          ]
        }
      },
      {
        statusExpected: 'archived',
        createdAt: undefined,
        url: 'tech-records',
        vehicle: { techRecord: [{ statusCode: 'archived', createdAt: '2022-02-14' }] }
      },
      {
        statusExpected: 'provisional',
        createdAt: undefined,
        url: 'tech-records',
        vehicle: { techRecord: [{ statusCode: 'archived', createdAt: '2022-02-14' }, { statusCode: 'provisional' }] }
      }
    ];
    it.each(routes)('should return the $statusExpected record', ({ statusExpected, createdAt, url, vehicle }) => {
      const techRecord = selectNonEditingTechRecord.projector(vehicle as unknown as VehicleTechRecordModel, { techCreatedAt: createdAt }, url);
      expect(techRecord).toBeDefined();
      expect(techRecord?.statusCode).toBe(statusExpected);
      createdAt && techRecord && expect(new Date(techRecord.createdAt).getTime()).toBe(createdAt);
    });
  });

  describe('getSingleVehicleType', () => {
    it('should return the correct vehicle type', () => {
      const systemNumber = 'VIN0001';
      const systemNumbers = ['VIN0001', 'VIN0002', 'VIN0003'];
      const vehicleTechRecords = systemNumbers.map(
        systemNumber =>
          ({
            systemNumber,
            vin: '123',
            techRecord: [
              {
                createdAt: new Date('2022-01-01').toISOString()
              },
              {
                createdAt: new Date('2022-01-03').toISOString()
              },
              {
                createdAt: new Date('2022-01-02').toISOString()
              }
            ]
          } as unknown as VehicleTechRecordModel)
      );
      const state: TechnicalRecordServiceState = { ...initialState, vehicleTechRecord: vehicleTechRecords };
      const selectedVehicleType = getSingleVehicleType.projector(state);
      expect(selectedVehicleType).toBe(vehicleTechRecords[0].techRecord[0].vehicleType);
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
