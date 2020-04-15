import { Action } from '@ngrx/store';

import {
  GetVehicleTechRecordHavingStatusAllSuccess,
  SetSelectedVehicleTechRecordSuccess,
  SetViewState,
  UpdateVehicleTechRecordSuccess
} from '../actions/VehicleTechRecordModel.actions';
import { VehicleTechRecordReducers } from '@app/store/reducers/VehicleTechRecordModel.reducers';
import {
  VehicleTechRecordState,
  initialVehicleTechRecordModelState
} from '../state/VehicleTechRecordModel.state';
import { TechRecord } from '@app/models/tech-record.model';
import { RECORD_STATUS, VIEW_STATE } from '@app/app.enums';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';

const mockTechRecord: TechRecord = {
  statusCode: RECORD_STATUS.CURRENT
} as TechRecord;

const mockVehicleTechRecord: VehicleTechRecordModel = {
  systemNumber: '111363',
  vin: 'ABCD12345',
  techRecord: [mockTechRecord]
} as VehicleTechRecordModel;

describe('VehicleTechRecordModelReducers', () => {
  let state: VehicleTechRecordState;
  let resultState: VehicleTechRecordState;
  let action: any;

  describe('when initialised', () => {
    beforeEach(() => {
      action = {} as Action;
      state = initialVehicleTechRecordModelState;
      resultState = VehicleTechRecordReducers(state, action);
    });

    it('should set the default state', () => {
      expect(resultState).toMatchSnapshot();
    });
  });

  describe('GetVehicleTechRecordHavingStatusAllSuccess', () => {
    it('should set vehicle record(s) to the store', () => {
      action = new GetVehicleTechRecordHavingStatusAllSuccess([mockVehicleTechRecord]);
      state = {
        vehicleTechRecordModel: null
      } as VehicleTechRecordState;

      resultState = VehicleTechRecordReducers(state, action);

      expect(resultState).toMatchSnapshot();
    });
  });

  describe('UpdateVehicleTechRecordSuccess', () => {
    it('should update the vehicle record in the store', () => {
      const recordToUpdate = {
        ...mockVehicleTechRecord,
        techRecord: [
          {
            createdAt: '2020-06-26T10:26:54.903Z'
          }
        ]
      } as VehicleTechRecordModel;

      action = new UpdateVehicleTechRecordSuccess(recordToUpdate);
      state = {
        vehicleTechRecordModel: [mockVehicleTechRecord]
      } as VehicleTechRecordState;

      resultState = VehicleTechRecordReducers(state, action);

      expect(resultState).toMatchSnapshot();
    });
  });

  describe('SetSelectedVehicleTechRecordSuccess', () => {
    it('should set selected vehicle record to the store', () => {
      action = new SetSelectedVehicleTechRecordSuccess(mockVehicleTechRecord);
      state = {
        selectedVehicleTechRecord: null
      } as VehicleTechRecordState;

      resultState = VehicleTechRecordReducers(state, action);

      expect(resultState).toMatchSnapshot();
    });
  });

  describe('SetViewState', () => {
    it('should set current viewstate to the store', () => {
      action = new SetViewState(VIEW_STATE.EDIT);
      state = {
        viewState: VIEW_STATE.VIEW_ONLY
      } as VehicleTechRecordState;

      resultState = VehicleTechRecordReducers(state, action);

      expect(resultState).toMatchSnapshot();
    });
  });
});
