import { TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { createMock, createMockList } from 'ts-auto-mock';
import { initialState, TechnicalRecordServiceState } from '../reducers/technical-record-service.reducer';
import { selectVehicleTechnicalRecordsBySystemNumber, technicalRecordsLoadingState, vehicleTechRecords } from './technical-record-service.selectors';

describe('Tech Record Selectors', () => {
  describe('selectedTestResultState', () => {
    it('should return vehicleTechRecords state', () => {
      const state: TechnicalRecordServiceState = { ...initialState, vehicleTechRecords: [createMock<VehicleTechRecordModel>()] };
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
      const vehicleTechRecords = createMockList<VehicleTechRecordModel>(1, i =>
        createMock<VehicleTechRecordModel>({
          systemNumber,
          vin: '123',
          techRecord: [
            createMock<TechRecordModel>({
              createdAt: new Date('2022-01-01').toISOString()
            }),
            createMock<TechRecordModel>({
              createdAt: new Date('2022-01-03').toISOString()
            }),
            createMock<TechRecordModel>({
              createdAt: new Date('2022-01-02').toISOString()
            })
          ]
        })
      );

      const selectedState = selectVehicleTechnicalRecordsBySystemNumber.projector(vehicleTechRecords, { systemNumber, vin: '123' });

      const expectedTechRecord = vehicleTechRecords[0].techRecord;
      expect(selectedState?.techRecord[0].createdAt).toStrictEqual(expectedTechRecord[1].createdAt);
      expect(selectedState?.techRecord[1].createdAt).toStrictEqual(expectedTechRecord[2].createdAt);
      expect(selectedState?.techRecord[2].createdAt).toStrictEqual(expectedTechRecord[0].createdAt);
    });
  });
});
