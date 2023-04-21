import { BodyTypeCode, BodyTypeDescription } from '@models/body-type-enum';
import { PsvMake } from '@models/reference-data.model';
import { VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
import { mockVehicleTechnicalRecord, mockVehicleTechnicalRecordList } from '../../../../mocks/mock-vehicle-technical-record.mock';
import {
  archiveTechRecord,
  archiveTechRecordFailure,
  archiveTechRecordSuccess,
  createProvisionalTechRecord,
  createProvisionalTechRecordFailure,
  createProvisionalTechRecordSuccess,
  createVehicleRecord,
  createVehicleRecordFailure,
  createVehicleRecordSuccess,
  getByAll,
  getByAllFailure,
  getByAllSuccess,
  getByPartialVin,
  getByPartialVinFailure,
  getByPartialVinSuccess,
  getByTrailerId,
  getByTrailerIdFailure,
  getByTrailerIdSuccess,
  getBySystemNumber,
  getBySystemNumberFailure,
  getBySystemNumberSuccess,
  getByVin,
  getByVinFailure,
  getByVinSuccess,
  getByVrm,
  getByVrmFailure,
  getByVrmSuccess,
  updateEditingTechRecord,
  updateEditingTechRecordCancel,
  updateTechRecords,
  updateTechRecordsFailure,
  updateTechRecordsSuccess,
  addAxle,
  removeAxle,
  updateBrakeForces,
  updateBody
} from '../actions/technical-record-service.actions';
import { initialState, TechnicalRecordServiceState, vehicleTechRecordReducer } from './technical-record-service.reducer';

describe('Vehicle Technical Record Reducer', () => {
  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = {
        type: 'Unknown'
      };
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('getByPartialVIN', () => {
    it('should set all vehicle technical records', () => {
      const newState: TechnicalRecordServiceState = {
        ...initialState,
        loading: true
      };
      const action = getByPartialVin({ partialVin: 'somevin' });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByPartialVINSuccess', () => {
    it('should set all vehicle technical records', () => {
      const records = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 5);
      const newState: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: records
      };
      const action = getByPartialVinSuccess({ vehicleTechRecords: [...records] });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByPartialVINFailure', () => {
    it('should set error state', () => {
      const error = 'fetching vehicle tech records failed';
      const newState = { ...initialState, error };
      const action = getByPartialVinFailure({ error });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByVIN', () => {
    it('should set all vehicle technical records', () => {
      const newState: TechnicalRecordServiceState = {
        ...initialState,
        loading: true
      };
      const action = getByVin({ vin: 'somevin' });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByVINSuccess', () => {
    it('should set all vehicle technical records', () => {
      const records = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 5);
      const newState: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: records
      };
      const action = getByVinSuccess({ vehicleTechRecords: [...records] });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByVINFailure', () => {
    it('should set error state', () => {
      const error = 'fetching vehicle tech records failed';
      const newState = { ...initialState, error };
      const action = getByVinFailure({ error });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByVrm', () => {
    it('should set all vehicle technical records', () => {
      const newState: TechnicalRecordServiceState = { ...initialState, loading: true };
      const action = getByVrm({ vrm: 'someVrm' });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByVrmSuccess', () => {
    it('should set all vehicle technical records', () => {
      const records = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 5);
      const newState: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: records
      };
      const action = getByVrmSuccess({ vehicleTechRecords: [...records] });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByVrmFailure', () => {
    it('should set error state', () => {
      const error = 'fetching vehicle tech records failed';
      const newState = { ...initialState, error };
      const action = getByVrmFailure({ error });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByTrailerId', () => {
    it('should set all vehicle technical records', () => {
      const newState: TechnicalRecordServiceState = { ...initialState, loading: true };
      const action = getByTrailerId({ trailerId: 'someTrailerId' });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByTrailerIdSuccess', () => {
    it('should set all vehicle technical records', () => {
      const records = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 5);
      const newState: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: records
      };
      const action = getByTrailerIdSuccess({ vehicleTechRecords: [...records] });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByTrailerIdFailure', () => {
    it('should set error state', () => {
      const error = 'fetching vehicle tech records failed';
      const newState = { ...initialState, error };
      const action = getByTrailerIdFailure({ error });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getBySystemNumber', () => {
    it('should set all vehicle technical records', () => {
      const newState: TechnicalRecordServiceState = { ...initialState, loading: true };
      const action = getBySystemNumber({ systemNumber: '001' });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getBySystemNumberSuccess', () => {
    it('should set all vehicle technical records', () => {
      const records = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 5);
      const newState: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: records
      };
      const action = getBySystemNumberSuccess({ vehicleTechRecords: [...records] });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getBySystemNumberFailure', () => {
    it('should set error state', () => {
      const error = 'fetching vehicle tech records failed';
      const newState = { ...initialState, error };
      const action = getBySystemNumberFailure({ error });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByAll', () => {
    it('should set all vehicle technical records', () => {
      const newState: TechnicalRecordServiceState = { ...initialState, loading: true };
      const action = getByAll({ all: '001' });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByAllSuccess', () => {
    it('should set all vehicle technical records', () => {
      const records = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 5);
      const newState: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: records
      };
      const action = getByAllSuccess({ vehicleTechRecords: [...records] });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getByAllFailure', () => {
    it('should set error state', () => {
      const error = 'fetching vehicle tech records failed';
      const newState = { ...initialState, error };
      const action = getByAllFailure({ error });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('createVehicleRecord', () => {
    it('should set loading to true', () => {
      const expectedVehicles = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1);

      const oldState: TechnicalRecordServiceState = { ...initialState, vehicleTechRecords: expectedVehicles, loading: false };

      const newState = vehicleTechRecordReducer(oldState, createVehicleRecord({ vehicle: {} as VehicleTechRecordModel }));

      expect(newState).not.toBe(oldState);
      expect(newState.vehicleTechRecords.length).toBe(1);
      expect(newState.loading).toBeTruthy();
    });
  });

  describe('createVehicleRecordSuccess', () => {
    it('should update the vehicleTechRecords property of the state with the newly created vehicle and set loading to false', () => {
      const oldState: TechnicalRecordServiceState = { ...initialState, vehicleTechRecords: mockVehicleTechnicalRecordList(VehicleTypes.PSV, 5) };

      const expectedVehicles = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 2);

      const action = createVehicleRecordSuccess({ vehicleTechRecords: expectedVehicles });

      const newState = vehicleTechRecordReducer(oldState, action);

      expect(newState.loading).toBeFalsy();
    });
  });

  describe('createVehicleRecordFailure', () => {
    it('should add an error to the state and set loading to false', () => {
      const action = createVehicleRecordFailure({ error: 'something bad happened' });
      const newState = vehicleTechRecordReducer(initialState, action);

      expect(newState.loading).toBeFalsy();
    });
  });

  describe('createProvisionalTechRecord', () => {
    it('should set the new vehicle tech records state after update', () => {
      const state: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1),
        loading: true
      };
      const action = createProvisionalTechRecord({ systemNumber: '001' });
      const newState = vehicleTechRecordReducer(state, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
      expect(state.vehicleTechRecords.length).toBeGreaterThan(0);
    });
  });

  describe('createProvisionalTechRecordSuccess', () => {
    it('should set the new vehicle tech records state after update success', () => {
      const oldRecord = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 5);
      const newRecord = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 2);

      const state: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: oldRecord
      };
      const action = createProvisionalTechRecordSuccess({ vehicleTechRecords: [...newRecord] });
      const newState = vehicleTechRecordReducer(state, action);

      expect(state).not.toEqual(newState);
      expect(newState.vehicleTechRecords).toEqual(newRecord);
    });
  });

  describe('createProvisionalTechRecordFailure', () => {
    it('should set error state', () => {
      const error = 'fetching vehicle tech records failed';
      const action = createProvisionalTechRecordFailure({ error });
      const newState = vehicleTechRecordReducer(initialState, action);

      expect(initialState).not.toEqual(newState);
      expect(newState.error).toEqual(error);
      expect(initialState).not.toBe(newState);
    });
  });

  describe('updateTechRecords', () => {
    it('should set the new vehicle tech records state after update', () => {
      const state: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1),
        loading: true
      };
      const action = updateTechRecords({ systemNumber: '001' });
      const newState = vehicleTechRecordReducer(state, action);

      expect(newState).toEqual(state);
      expect(newState).not.toBe(state);
      expect(newState.vehicleTechRecords.length).toBeGreaterThan(0);
    });
  });

  describe('updateTechRecordsSuccess', () => {
    it('should set the new vehicle tech records state after update success', () => {
      const oldRecord = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 5);
      const newRecord = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 2);

      const state: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: oldRecord
      };
      const action = updateTechRecordsSuccess({ vehicleTechRecords: [...newRecord] });
      const newState = vehicleTechRecordReducer(state, action);

      expect(state).not.toEqual(newState);
      expect(newState.vehicleTechRecords).toEqual(newRecord);
    });
  });

  describe('updateTechRecordsFailure', () => {
    it('should set error state', () => {
      const error = 'fetching vehicle tech records failed';
      const action = updateTechRecordsFailure({ error });
      const newState = vehicleTechRecordReducer(initialState, action);

      expect(initialState).not.toEqual(newState);
      expect(newState.error).toEqual(error);
      expect(initialState).not.toBe(newState);
    });
  });

  describe('archiveTechRecord', () => {
    it('should set the new vehicle tech records state after update', () => {
      const state: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: mockVehicleTechnicalRecordList(VehicleTypes.PSV, 1),
        loading: true
      };
      const action = archiveTechRecord({ systemNumber: '001', reasonForArchiving: 'some reason' });
      const newState = vehicleTechRecordReducer(state, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
      expect(state.vehicleTechRecords.length).toBeGreaterThan(0);
    });
  });

  describe('archiveTechRecordSuccess', () => {
    it('should set the new vehicle tech records state after update success', () => {
      const oldRecord = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 5);
      const newRecord = mockVehicleTechnicalRecordList(VehicleTypes.PSV, 2);

      const state: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecords: oldRecord
      };
      const action = archiveTechRecordSuccess({ vehicleTechRecords: [...newRecord] });
      const newState = vehicleTechRecordReducer(state, action);

      expect(state).not.toEqual(newState);
      expect(newState.vehicleTechRecords).toEqual(newRecord);
    });
  });

  describe('archiveTechRecordFailure', () => {
    it('should set error state', () => {
      const error = 'fetching vehicle tech records failed';
      const action = archiveTechRecordFailure({ error });
      const newState = vehicleTechRecordReducer(initialState, action);

      expect(initialState).not.toEqual(newState);
      expect(newState.error).toEqual(error);
      expect(initialState).not.toBe(newState);
    });
  });

  describe('updateEditingTechRecord', () => {
    it('should set the editingTechRecord', () => {
      const vehicleTechRecord = { vin: '' } as VehicleTechRecordModel;
      const action = updateEditingTechRecord({ vehicleTechRecord: vehicleTechRecord });
      const newState = vehicleTechRecordReducer(initialState, action);

      expect(initialState).not.toEqual(newState);
      expect(newState.editingTechRecord).toEqual(vehicleTechRecord);
      expect(initialState).not.toBe(newState);
    });
  });

  describe('updateEditingTechRecordCancel', () => {
    it('should clear the state', () => {
      initialState.editingTechRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV);
      const action = updateEditingTechRecordCancel();
      const newState = vehicleTechRecordReducer(initialState, action);

      expect(initialState).not.toEqual(newState);
      expect(newState.editingTechRecord).toBeUndefined();
      expect(initialState).not.toBe(newState);
    });
  });

  describe('updating properties of the tech record in edit', () => {
    beforeEach(() => (initialState.editingTechRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV)));

    describe('updateBrakeForces', () => {
      it('should update brake forces', () => {
        initialState.editingTechRecord!.techRecord[0].brakes!.brakeCodeOriginal = '80';
        const brakes = initialState.editingTechRecord?.techRecord[0].brakes;
        expect(brakes?.brakeCode).toBe('1234');

        const newState = vehicleTechRecordReducer(initialState, updateBrakeForces({ grossKerbWeight: 1000, grossLadenWeight: 2000 }));

        expect(newState).not.toBe(initialState);
        expect(newState).not.toEqual(initialState);

        const updatedBrakes = newState.editingTechRecord?.techRecord[0].brakes;
        expect(updatedBrakes?.brakeCode).toBe(`0${2000 / 100}${brakes?.brakeCodeOriginal}`);

        expect(updatedBrakes?.brakeForceWheelsNotLocked?.serviceBrakeForceA).toBe(Math.round((2000 * 16) / 100));
        expect(updatedBrakes?.brakeForceWheelsNotLocked?.secondaryBrakeForceA).toBe(Math.round((2000 * 22.5) / 100));
        expect(updatedBrakes?.brakeForceWheelsNotLocked?.parkingBrakeForceA).toBe(Math.round((2000 * 45) / 100));

        expect(updatedBrakes?.brakeForceWheelsUpToHalfLocked?.serviceBrakeForceB).toBe(Math.round((1000 * 16) / 100));
        expect(updatedBrakes?.brakeForceWheelsUpToHalfLocked?.secondaryBrakeForceB).toBe(Math.round((1000 * 25) / 100));
        expect(updatedBrakes?.brakeForceWheelsUpToHalfLocked?.parkingBrakeForceB).toBe(Math.round((1000 * 50) / 100));
      });
    });

    describe('updateBody', () => {
      it('should update body', () => {
        expect(initialState.editingTechRecord?.techRecord[0].bodyType?.description).toBe(BodyTypeDescription.DOUBLE_DECKER);

        const expectedData = {
          dtpNumber: '9999',
          psvChassisMake: 'Toyota',
          psvChassisModel: 'Supra',
          psvBodyMake: 'Random',
          psvBodyType: 'o'
        } as PsvMake;

        const newState = vehicleTechRecordReducer(initialState, updateBody({ psvMake: expectedData }));

        expect(newState).not.toBe(initialState);
        expect(newState).not.toEqual(initialState);

        const updatedTechRecord = newState.editingTechRecord?.techRecord[0];
        expect(updatedTechRecord?.bodyType?.code).toBe(BodyTypeCode.O);
        expect(updatedTechRecord?.bodyType?.description).toBe(BodyTypeDescription.OTHER);
        expect(updatedTechRecord?.bodyMake).toBe(expectedData.psvBodyMake);
        expect(updatedTechRecord?.chassisMake).toBe(expectedData.psvChassisMake);
        expect(updatedTechRecord?.chassisModel).toBe(expectedData.psvChassisModel);
      });
    });

    describe('addAxle', () => {
      describe('it should add an axle', () => {
        it('with the axles property defined', () => {
          const techRecord = initialState.editingTechRecord?.techRecord[0];
          expect(techRecord?.noOfAxles).toBe(2);
          expect(techRecord?.axles?.length).toBe(3);

          const newState = vehicleTechRecordReducer(initialState, addAxle());

          expect(newState).not.toBe(initialState);
          expect(newState).not.toEqual(initialState);

          const updatedTechRecord = newState.editingTechRecord?.techRecord[0];
          expect(updatedTechRecord?.noOfAxles).toBe(4);
          expect(updatedTechRecord?.axles?.length).toBe(4);

          const newAxleField = updatedTechRecord?.axles || [];
          expect(newAxleField[3].tyres).toEqual({
            dataTrAxles: null,
            fitmentCode: null,
            plyRating: null,
            speedCategorySymbol: null,
            tyreCode: null,
            tyreSize: null
          });
          expect(newAxleField[3].weights).toEqual({
            designWeight: null,
            gbWeight: null,
            kerbWeight: null,
            ladenWeight: null
          });
          expect(updatedTechRecord?.axles?.pop()?.axleNumber).toBe(4);
        });

        it('without the axles property defined', () => {
          const techRecord = initialState.editingTechRecord?.techRecord[0];
          delete techRecord?.axles;
          techRecord!.noOfAxles = 0;
          expect(techRecord?.noOfAxles).toBe(0);

          const newState = vehicleTechRecordReducer(initialState, addAxle());

          expect(newState).not.toBe(initialState);
          expect(newState).not.toEqual(initialState);

          const updatedTechRecord = newState.editingTechRecord?.techRecord[0];
          expect(updatedTechRecord?.noOfAxles).toBe(1);
          expect(updatedTechRecord?.axles?.length).toBe(1);

          const newAxleField = updatedTechRecord?.axles || [];
          expect(newAxleField[0].tyres).toEqual({
            dataTrAxles: null,
            fitmentCode: null,
            plyRating: null,
            speedCategorySymbol: null,
            tyreCode: null,
            tyreSize: null
          });
          expect(newAxleField[0].weights).toEqual({
            designWeight: null,
            gbWeight: null,
            kerbWeight: null,
            ladenWeight: null
          });
          expect(updatedTechRecord?.axles?.pop()?.axleNumber).toBe(1);
        });
      });
    });

    describe('removeAxle', () => {
      it('should remove specified axle', () => {
        const techRecord = initialState.editingTechRecord?.techRecord[0];
        expect(techRecord?.noOfAxles).toBe(2);
        expect(techRecord?.axles?.length).toBe(3);

        const newState = vehicleTechRecordReducer(initialState, removeAxle({ index: 0 }));

        expect(newState).not.toBe(initialState);
        expect(newState).not.toEqual(initialState);

        const updatedTechRecord = newState.editingTechRecord?.techRecord[0];
        expect(updatedTechRecord?.noOfAxles).toBe(2);
        expect(updatedTechRecord?.axles?.length).toBe(2);
        expect(updatedTechRecord?.axles?.pop()?.axleNumber).toBe(2);
      });
    });
  });
});
