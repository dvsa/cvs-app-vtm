import {
  EVehicleTechRecordModelActions,
  GetVehicleTechRecordModel,
  GetVehicleTechRecordModelHavingStatusAll,
  GetVehicleTechRecordModelHavingStatusAllSuccess,
  SetVehicleTechRecordModelOnCreate,
  UpdateVehicleTechRecord,
  UpdateVehicleTechRecordSuccess,
  SetSelectedVehicleTechnicalRecord,
  SetViewState
} from './VehicleTechRecordModel.actions';
import {
  VehicleIdentifiers,
  VehicleTechRecordModel,
  VehicleTechRecordEdit,
  VehicleTechRecordState
} from '@app/models/vehicle-tech-record.model';
import { TechRecord } from '@app/models/tech-record.model';
import { SearchParams } from '@app/models/search-params';
import { RECORD_STATUS, VIEW_STATE } from '@app/app.enums';

const vehicleTechRecordModel: VehicleTechRecordModel = {} as VehicleTechRecordModel;
const techRecord: TechRecord = {} as TechRecord;

describe('GetVehicleTechRecordModel', () => {
  it('the action should have the right type and payload', () => {
    const action = new GetVehicleTechRecordModel(techRecord);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordModelActions.GetVehicleTechRecordModel,
      payload: techRecord
    });
  });
});

describe('GetVehicleTechRecordModelHavingStatusAll', () => {
  it('the action should have the right type and payload', () => {
    const searchParams: SearchParams = { searchIdentifier: '1234', searchCriteria: 'all' };
    const action = new GetVehicleTechRecordModelHavingStatusAll(searchParams);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAll,
      payload: searchParams
    });
  });
});

describe('GetVehicleTechRecordModelHavingStatusAllSuccess', () => {
  it('the action should have the right type and payload', () => {
    const action = new GetVehicleTechRecordModelHavingStatusAllSuccess([vehicleTechRecordModel]);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordModelActions.GetVehicleTechRecordModelHavingStatusAllSuccess,
      vehicleTechRecords: [vehicleTechRecordModel]
    });
  });
});

describe('SetVehicleTechRecordModelOnCreate', () => {
  it('the action should have the right type and payload', () => {
    const vehicleIdentifiers: VehicleIdentifiers = {
      vin: 'aaa',
      vrm: 'bbb',
      vType: 'PSV'
    } as VehicleIdentifiers;

    const action = new SetVehicleTechRecordModelOnCreate(vehicleIdentifiers);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordModelActions.SetVehicleTechRecordModelOnCreate,
      payload: vehicleIdentifiers
    });
  });
});

describe('UpdateVehicleTechRecord', () => {
  it('should create UpdateVehicleTechRecord action', () => {
    const vehicleRecordEdit: VehicleTechRecordEdit = {
      primaryVrm: 'vrm1',
      techRecord: [
        {
          statusCode: RECORD_STATUS.CURRENT
        }
      ]
    } as VehicleTechRecordEdit;

    const action = new UpdateVehicleTechRecord(vehicleRecordEdit);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordModelActions.UpdateVehicleTechRecord,
      vehicleRecordEdit
    });
  });

  it('should create UpdateVehicleTechRecordSuccess action', () => {
    const vehicleTechRecord: VehicleTechRecordModel = {
      techRecord: [
        {
          statusCode: RECORD_STATUS.CURRENT
        }
      ]
    } as VehicleTechRecordModel;

    const action = new UpdateVehicleTechRecordSuccess(vehicleTechRecord);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordModelActions.UpdateVehicleTechRecordSuccess,
      vehicleTechRecord
    });
  });
});

describe('SetSelectedVehicleTechnicalRecord', () => {
  it('should create SetSelectedVehicleTechnicalRecord action', () => {
    const vehicleRecordState: VehicleTechRecordState = {
      vehicleRecord: {
        systemNumber: '1232333',
        techRecord: [
          {
            statusCode: RECORD_STATUS.ARCHIVED
          }
        ]
      },
      viewState: VIEW_STATE.VIEW_ONLY
    } as VehicleTechRecordState;

    const action = new SetSelectedVehicleTechnicalRecord(vehicleRecordState);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordModelActions.SetSelectedVehicleTechnicalRecord,
      vehicleRecordState
    });
  });
});

describe('SetViewState', () => {
  it('should create SetViewState action', () => {
    const viewState: VIEW_STATE = VIEW_STATE.EDIT;

    const action = new SetViewState(viewState);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordModelActions.SetViewState,
      viewState
    });
  });
});
