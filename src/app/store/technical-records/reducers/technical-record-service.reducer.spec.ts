import { BodyTypeCode, BodyTypeDescription } from '@models/body-type-enum';
import { PsvMake } from '@models/reference-data.model';
import { V3TechRecordModel, VehicleTechRecordModel, VehicleTypes } from '@models/vehicle-tech-record.model';
// import { mockVehicleTechnicalRecord, mockVehicleTechnicalRecordList } from '../../../../mocks/mock-vehicle-technical-record.mock';
import {
  archiveTechRecord,
  archiveTechRecordFailure,
  archiveTechRecordSuccess,
  createProvisionalTechRecord,
  // createProvisionalTechRecordFailure,
  // createProvisionalTechRecordSuccess,
  createVehicleRecord,
  createVehicleRecordFailure,
  createVehicleRecordSuccess,
  getBySystemNumber,
  getBySystemNumberFailure,
  getBySystemNumberSuccess,
  updateEditingTechRecord,
  updateEditingTechRecordCancel,
  updateTechRecords,
  updateTechRecordsFailure,
  updateTechRecordsSuccess,
  addAxle,
  removeAxle,
  updateBrakeForces,
  updateBody,
  addSectionState,
  removeSectionState,
  clearAllSectionStates
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
      const record = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' };
      const newState: TechnicalRecordServiceState = {
        ...initialState,
        techRecordHistory: [{ systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' }]
      };
      const action = getBySystemNumberSuccess({ techRecordHistory: [record] });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('getBySystemNumberFailure', () => {
    it('should history to an empty array', () => {
      const newState = { ...initialState };
      const action = getBySystemNumberFailure({ techRecordHistory: [] });
      const state = vehicleTechRecordReducer(initialState, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
    });
  });

  describe('createVehicleRecord', () => {
    it('should set loading to true', () => {
      const expectedVehicle = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' };

      const oldState: TechnicalRecordServiceState = { ...initialState, vehicleTechRecord: expectedVehicle, loading: false };

      const newState = vehicleTechRecordReducer(oldState, createVehicleRecord({ vehicle: {} as V3TechRecordModel }));

      expect(newState).not.toBe(oldState);
      expect(newState.vehicleTechRecord).toEqual(expectedVehicle);
      expect(newState.loading).toBeTruthy();
    });
  });

  describe('createVehicleRecordSuccess', () => {
    it('should update the vehicleTechRecords property of the state with the newly created vehicle and set loading to false', () => {
      const oldState: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecord: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' }
      };

      const expectedVehicle = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' };

      const action = createVehicleRecordSuccess({ vehicleTechRecords: expectedVehicle });

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
  // TODO V3 do we need createprovisional any more?
  // describe('createProvisionalTechRecord', () => {
  //   it('should set the new vehicle tech records state after update', () => {
  //     const state: TechnicalRecordServiceState = {
  //       ...initialState,
  //       vehicleTechRecord: {systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin'},
  //       loading: true
  //     };
  //     const action = createProvisionalTechRecord({ systemNumber: '001' });
  //     const newState = vehicleTechRecordReducer(state, action);

  //     expect(state).toEqual(newState);
  //     expect(state).not.toBe(newState);
  //     expect(state.vehicleTechRecord).toEqual({systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin'});
  //   });
  // });

  // describe('createProvisionalTechRecordSuccess', () => {
  //   it('should set the new vehicle tech records state after update success', () => {
  //     const oldRecord = {systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin'};
  //     const newRecord = {systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin2'};

  //     const state: TechnicalRecordServiceState = {
  //       ...initialState,
  //       vehicleTechRecord: oldRecord
  //     };
  //     const action = createProvisionalTechRecordSuccess({ vehicleTechRecords: [...newRecord] });
  //     const newState = vehicleTechRecordReducer(state, action);

  //     expect(state).not.toEqual(newState);
  //     expect(newState.vehicleTechRecord).toEqual(newRecord);
  //   });
  // });

  // describe('createProvisionalTechRecordFailure', () => {
  //   it('should set error state', () => {
  //     const error = 'fetching vehicle tech records failed';
  //     const action = createProvisionalTechRecordFailure({ error });
  //     const newState = vehicleTechRecordReducer(initialState, action);

  //     expect(initialState).not.toEqual(newState);
  //     expect(newState.error).toEqual(error);
  //     expect(initialState).not.toBe(newState);
  //   });
  // });

  describe('updateTechRecords', () => {
    it('should set the new vehicle tech records state after update', () => {
      const state: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecord: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' },
        loading: true
      };
      const action = updateTechRecords({ vehicleTechRecord: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVinNew' } });
      const newState = vehicleTechRecordReducer(state, action);

      expect(newState).toEqual(state);
      expect(newState).not.toBe(state);
      expect(newState.loading).toEqual(true);
    });
  });

  describe('updateTechRecordsSuccess', () => {
    it('should set the new vehicle tech records state after update success', () => {
      const oldRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' };
      const newRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVinNew' };

      const state: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecord: oldRecord
      };
      const action = updateTechRecordsSuccess({ vehicleTechRecord: newRecord });
      const newState = vehicleTechRecordReducer(state, action);

      expect(state).not.toEqual(newState);
      expect(newState.vehicleTechRecord).toEqual(newRecord);
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
    it('should set the state to loading', () => {
      const state: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecord: { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' },
        loading: true
      };
      const action = archiveTechRecord({ systemNumber: 'foo', createdTimestamp: 'bar', reasonForArchiving: 'some reason' });
      const newState = vehicleTechRecordReducer(state, action);

      expect(state).toEqual(newState);
      expect(state).not.toBe(newState);
      expect(state.loading).toEqual(true);
    });
  });

  describe('archiveTechRecordSuccess', () => {
    it('should set the new vehicle tech records state after update success', () => {
      const oldRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' };
      const newRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVinNew' };

      const state: TechnicalRecordServiceState = {
        ...initialState,
        vehicleTechRecord: oldRecord
      };
      const action = archiveTechRecordSuccess({ vehicleTechRecord: newRecord });
      const newState = vehicleTechRecordReducer(state, action);

      expect(state).not.toEqual(newState);
      expect(newState.vehicleTechRecord).toEqual(newRecord);
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
      const vehicleTechRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' };
      const action = updateEditingTechRecord({ vehicleTechRecord: vehicleTechRecord });
      const newState = vehicleTechRecordReducer(initialState, action);

      expect(initialState).not.toEqual(newState);
      expect(newState.editingTechRecord).toEqual(vehicleTechRecord);
      expect(initialState).not.toBe(newState);
    });
  });

  describe('updateEditingTechRecordCancel', () => {
    it('should clear the state', () => {
      initialState.editingTechRecord = { systemNumber: 'foo', createdTimestamp: 'bar', vin: 'testVin' };
      const action = updateEditingTechRecordCancel();
      const newState = vehicleTechRecordReducer(initialState, action);

      expect(initialState).not.toEqual(newState);
      expect(newState.editingTechRecord).toBeUndefined();
      expect(initialState).not.toBe(newState);
    });
  });

  describe('Section state changes', () => {
    it('should add the section name to the state', () => {
      initialState.sectionState = [];
      const action = addSectionState({ section: 'TEST_SECTION' });
      const newState = vehicleTechRecordReducer(initialState, action);

      expect(initialState).not.toEqual(newState);
      expect(newState.sectionState).toEqual(['TEST_SECTION']);
      expect(initialState).not.toBe(newState);
    });

    it('should avoid duplicating the section name', () => {
      initialState.sectionState = ['TEST_SECTION'];
      const action = addSectionState({ section: 'TEST_SECTION' });
      const newState = vehicleTechRecordReducer(initialState, action);

      expect(initialState).toEqual(newState);
      expect(newState.sectionState).toEqual(['TEST_SECTION']);
      expect(initialState).not.toBe(newState);
    });

    it('should remove the section name from the state', () => {
      initialState.sectionState = ['TEST_SECTION1', 'TEST_SECTION2'];
      const action = removeSectionState({ section: 'TEST_SECTION1' });
      const newState = vehicleTechRecordReducer(initialState, action);

      expect(initialState).not.toEqual(newState);
      expect(newState.sectionState).toEqual(['TEST_SECTION2']);
      expect(initialState).not.toBe(newState);
    });

    it('should clear all the section names from the state', () => {
      initialState.sectionState = ['TEST_SECTION1', 'TEST_SECTION2'];
      const action = clearAllSectionStates();
      const newState = vehicleTechRecordReducer(initialState, action);

      expect(initialState).not.toEqual(newState);
      expect(newState.sectionState).toEqual([]);
      expect(initialState).not.toBe(newState);
    });
  });
  //TODO V3 HGV/PSV tests
  // describe('updating properties of the tech record in edit', () => {
  // beforeEach(() => (initialState.editingTechRecord = mockVehicleTechnicalRecord(VehicleTypes.PSV)));

  //   describe('updateBrakeForces', () => {
  //     it('should not update half locked brake forces with no gross kerb weight', () => {
  //       initialState.editingTechRecord!.techRecord[0].brakes!.brakeCodeOriginal = '80';
  //       initialState.editingTechRecord!.techRecord[0].brakes!.brakeForceWheelsUpToHalfLocked = {
  //         parkingBrakeForceB: 50,
  //         secondaryBrakeForceB: 30,
  //         serviceBrakeForceB: 10
  //       };
  //       const brakes = initialState.editingTechRecord?.techRecord[0].brakes;
  //       expect(brakes?.brakeCode).toBe('1234');

  //       const newState = vehicleTechRecordReducer(initialState, updateBrakeForces({ grossLadenWeight: 2000 }));

  //       const updatedBrakes = newState.editingTechRecord?.techRecord[0].brakes;
  //       expect(updatedBrakes?.brakeCode).toBe(`0${2000 / 100}${brakes?.brakeCodeOriginal}`);

  //       expect(updatedBrakes?.brakeForceWheelsNotLocked?.serviceBrakeForceA).toBe(Math.round((2000 * 16) / 100));
  //       expect(updatedBrakes?.brakeForceWheelsNotLocked?.secondaryBrakeForceA).toBe(Math.round((2000 * 22.5) / 100));
  //       expect(updatedBrakes?.brakeForceWheelsNotLocked?.parkingBrakeForceA).toBe(Math.round((2000 * 45) / 100));

  //       expect(updatedBrakes?.brakeForceWheelsUpToHalfLocked?.serviceBrakeForceB).toBe(10);
  //       expect(updatedBrakes?.brakeForceWheelsUpToHalfLocked?.secondaryBrakeForceB).toBe(30);
  //       expect(updatedBrakes?.brakeForceWheelsUpToHalfLocked?.parkingBrakeForceB).toBe(50);
  //     });

  //     it('should not update half locked brake forces with no gross laden weight', () => {
  //       initialState.editingTechRecord!.techRecord[0].brakes!.brakeCodeOriginal = '80';
  //       initialState.editingTechRecord!.techRecord[0].brakes!.brakeForceWheelsNotLocked = {
  //         parkingBrakeForceA: 50,
  //         secondaryBrakeForceA: 30,
  //         serviceBrakeForceA: 10
  //       };

  //       const newState = vehicleTechRecordReducer(initialState, updateBrakeForces({ grossKerbWeight: 1000 }));

  //       const updatedBrakes = newState.editingTechRecord?.techRecord[0].brakes;
  //       expect(updatedBrakes?.brakeCode).toBe('1234');

  //       expect(updatedBrakes?.brakeForceWheelsNotLocked?.serviceBrakeForceA).toBe(10);
  //       expect(updatedBrakes?.brakeForceWheelsNotLocked?.secondaryBrakeForceA).toBe(30);
  //       expect(updatedBrakes?.brakeForceWheelsNotLocked?.parkingBrakeForceA).toBe(50);

  //       expect(updatedBrakes?.brakeForceWheelsUpToHalfLocked?.serviceBrakeForceB).toBe(Math.round((1000 * 16) / 100));
  //       expect(updatedBrakes?.brakeForceWheelsUpToHalfLocked?.secondaryBrakeForceB).toBe(Math.round((1000 * 25) / 100));
  //       expect(updatedBrakes?.brakeForceWheelsUpToHalfLocked?.parkingBrakeForceB).toBe(Math.round((1000 * 50) / 100));
  //     });

  //     it('should not update brakeCode with no gross laden weight', () => {
  //       initialState.editingTechRecord!.techRecord[0].brakes!.brakeCodeOriginal = '80';
  //       initialState.editingTechRecord!.techRecord[0].brakes!.brakeCode = '37';

  //       const newState = vehicleTechRecordReducer(initialState, updateBrakeForces({ grossKerbWeight: 1000 }));
  //       const updatedBrakes = newState.editingTechRecord?.techRecord[0].brakes;
  //       expect(updatedBrakes?.brakeCode).toBe('37');
  //     });

  //     it('should update brake forces', () => {
  //       initialState.editingTechRecord!.techRecord[0].brakes!.brakeCodeOriginal = '80';
  //       const brakes = initialState.editingTechRecord?.techRecord[0].brakes;
  //       expect(brakes?.brakeCode).toBe('1234');

  //       const newState = vehicleTechRecordReducer(initialState, updateBrakeForces({ grossKerbWeight: 1000, grossLadenWeight: 2000 }));

  //       expect(newState).not.toBe(initialState);
  //       expect(newState).not.toEqual(initialState);

  //       const updatedBrakes = newState.editingTechRecord?.techRecord[0].brakes;
  //       expect(updatedBrakes?.brakeCode).toBe(`0${2000 / 100}${brakes?.brakeCodeOriginal}`);

  //       expect(updatedBrakes?.brakeForceWheelsNotLocked?.serviceBrakeForceA).toBe(Math.round((2000 * 16) / 100));
  //       expect(updatedBrakes?.brakeForceWheelsNotLocked?.secondaryBrakeForceA).toBe(Math.round((2000 * 22.5) / 100));
  //       expect(updatedBrakes?.brakeForceWheelsNotLocked?.parkingBrakeForceA).toBe(Math.round((2000 * 45) / 100));

  //       expect(updatedBrakes?.brakeForceWheelsUpToHalfLocked?.serviceBrakeForceB).toBe(Math.round((1000 * 16) / 100));
  //       expect(updatedBrakes?.brakeForceWheelsUpToHalfLocked?.secondaryBrakeForceB).toBe(Math.round((1000 * 25) / 100));
  //       expect(updatedBrakes?.brakeForceWheelsUpToHalfLocked?.parkingBrakeForceB).toBe(Math.round((1000 * 50) / 100));
  //     });
  //   });

  //   describe('updateBody', () => {
  //     it('should update body', () => {
  //       expect(initialState.editingTechRecord?.techRecord[0].bodyType?.description).toBe(BodyTypeDescription.DOUBLE_DECKER);

  //       const expectedData = {
  //         dtpNumber: '9999',
  //         psvChassisMake: 'Toyota',
  //         psvChassisModel: 'Supra',
  //         psvBodyMake: 'Random',
  //         psvBodyType: 'o'
  //       } as PsvMake;

  //       const newState = vehicleTechRecordReducer(initialState, updateBody({ psvMake: expectedData }));

  //       expect(newState).not.toBe(initialState);
  //       expect(newState).not.toEqual(initialState);

  //       const updatedTechRecord = newState.editingTechRecord?.techRecord[0];
  //       expect(updatedTechRecord?.bodyType?.code).toBe(BodyTypeCode.O);
  //       expect(updatedTechRecord?.bodyType?.description).toBe(BodyTypeDescription.OTHER);
  //       expect(updatedTechRecord?.bodyMake).toBe(expectedData.psvBodyMake);
  //       expect(updatedTechRecord?.chassisMake).toBe(expectedData.psvChassisMake);
  //       expect(updatedTechRecord?.chassisModel).toBe(expectedData.psvChassisModel);
  //     });
  //   });

  //   describe('addAxle', () => {
  //     describe('it should add an axle', () => {
  //       it('with the axles property defined', () => {
  //         const techRecord = initialState.editingTechRecord?.techRecord[0];
  //         expect(techRecord?.noOfAxles).toBe(2);
  //         expect(techRecord?.axles?.length).toBe(3);

  //         const newState = vehicleTechRecordReducer(initialState, addAxle());

  //         expect(newState).not.toBe(initialState);
  //         expect(newState).not.toEqual(initialState);

  //         const updatedTechRecord = newState.editingTechRecord?.techRecord[0];
  //         expect(updatedTechRecord?.noOfAxles).toBe(4);
  //         expect(updatedTechRecord?.axles?.length).toBe(4);

  //         const newAxleField = updatedTechRecord?.axles || [];
  //         expect(newAxleField[3].tyres).toEqual({
  //           dataTrAxles: null,
  //           fitmentCode: null,
  //           plyRating: null,
  //           speedCategorySymbol: null,
  //           tyreCode: null,
  //           tyreSize: null
  //         });
  //         expect(newAxleField[3].weights).toEqual({
  //           designWeight: null,
  //           gbWeight: null,
  //           kerbWeight: null,
  //           ladenWeight: null
  //         });
  //         expect(updatedTechRecord?.axles?.pop()?.axleNumber).toBe(4);
  //       });

  //       it('without the axles property defined', () => {
  //         const techRecord = initialState.editingTechRecord?.techRecord[0];
  //         delete techRecord?.axles;
  //         techRecord!.noOfAxles = 0;
  //         expect(techRecord?.noOfAxles).toBe(0);

  //         const newState = vehicleTechRecordReducer(initialState, addAxle());

  //         expect(newState).not.toBe(initialState);
  //         expect(newState).not.toEqual(initialState);

  //         const updatedTechRecord = newState.editingTechRecord?.techRecord[0];
  //         expect(updatedTechRecord?.noOfAxles).toBe(1);
  //         expect(updatedTechRecord?.axles?.length).toBe(1);

  //         const newAxleField = updatedTechRecord?.axles || [];
  //         expect(newAxleField[0].tyres).toEqual({
  //           dataTrAxles: null,
  //           fitmentCode: null,
  //           plyRating: null,
  //           speedCategorySymbol: null,
  //           tyreCode: null,
  //           tyreSize: null
  //         });
  //         expect(newAxleField[0].weights).toEqual({
  //           designWeight: null,
  //           gbWeight: null,
  //           kerbWeight: null,
  //           ladenWeight: null
  //         });
  //         expect(updatedTechRecord?.axles?.pop()?.axleNumber).toBe(1);
  //       });
  //     });
  //   });

  //   describe('removeAxle', () => {
  //     it('should remove specified axle', () => {
  //       const techRecord = initialState.editingTechRecord?.techRecord[0];
  //       expect(techRecord?.noOfAxles).toBe(2);
  //       expect(techRecord?.axles?.length).toBe(3);

  //       const newState = vehicleTechRecordReducer(initialState, removeAxle({ index: 0 }));

  //       expect(newState).not.toBe(initialState);
  //       expect(newState).not.toEqual(initialState);

  //       const updatedTechRecord = newState.editingTechRecord?.techRecord[0];
  //       expect(updatedTechRecord?.noOfAxles).toBe(2);
  //       expect(updatedTechRecord?.axles?.length).toBe(2);
  //       expect(updatedTechRecord?.axles?.pop()?.axleNumber).toBe(2);
  //     });
  //   });
  // });
});
