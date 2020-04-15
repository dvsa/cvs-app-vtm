import {
  EVehicleTechRecordActions,
  GetVehicleTechRecordHavingStatusAll,
  GetVehicleTechRecordHavingStatusAllSuccess,
  SetVehicleTechRecordOnCreate,
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

const mockTechRecord: TechRecord = {
  statusCode: RECORD_STATUS.CURRENT
} as TechRecord;

const mockVehicleTechRecord: VehicleTechRecordModel = {
  techRecord: [mockTechRecord]
} as VehicleTechRecordModel;

const mockVehicleRecordEdit: VehicleTechRecordEdit = {
  primaryVrm: 'vrm1',
  techRecord: [mockTechRecord]
} as VehicleTechRecordEdit;

describe('GetVehicleTechRecordHavingStatusAll', () => {
  it('should create GetVehicleTechRecordHavingStatusAll action', () => {
    const searchParams: SearchParams = { searchIdentifier: '1234', searchCriteria: 'all' };
    const action = new GetVehicleTechRecordHavingStatusAll(searchParams);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordActions.GetVehicleTechRecordHavingStatusAll,
      payload: searchParams
    });
  });
});

describe('GetVehicleTechRecordHavingStatusAllSuccess', () => {
  it('should create GetVehicleTechRecordHavingStatusAllSuccess action', () => {
    const action = new GetVehicleTechRecordHavingStatusAllSuccess([mockVehicleTechRecord]);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordActions.GetVehicleTechRecordHavingStatusAllSuccess,
      vehicleTechRecords: [mockVehicleTechRecord]
    });
  });
});

describe('SetVehicleTechRecordOnCreate', () => {
  it('should create SetVehicleTechRecordOnCreate action', () => {
    const vehicleIdentifiers: VehicleIdentifiers = {
      vin: 'aaa',
      vrm: 'bbb',
      vType: 'PSV'
    } as VehicleIdentifiers;

    const action = new SetVehicleTechRecordOnCreate(vehicleIdentifiers);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordActions.SetVehicleTechRecordOnCreate,
      payload: vehicleIdentifiers
    });
  });
});

describe('CreateVehicleTechRecord', () => {
  it('should create CreateVehicleTechRecord action', () => {
    const action = new UpdateVehicleTechRecord(mockVehicleRecordEdit);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordActions.UpdateVehicleTechRecord,
      vehicleRecordEdit: mockVehicleRecordEdit
    });
  });
});

describe('UpdateVehicleTechRecord', () => {
  it('should create UpdateVehicleTechRecord action', () => {
    const action = new UpdateVehicleTechRecord(mockVehicleRecordEdit);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordActions.UpdateVehicleTechRecord,
      vehicleRecordEdit: mockVehicleRecordEdit
    });
  });

  it('should create UpdateVehicleTechRecordSuccess action', () => {
    const action = new UpdateVehicleTechRecordSuccess(mockVehicleTechRecord);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordActions.UpdateVehicleTechRecordSuccess,
      vehicleTechRecord: mockVehicleTechRecord
    });
  });
});

describe('SetSelectedVehicleTechnicalRecord', () => {
  it('should create SetSelectedVehicleTechnicalRecord action', () => {
    const vehicleRecordState: VehicleTechRecordState = {
      vehicleRecord: {
        systemNumber: '1232333',
        techRecord: [mockTechRecord]
      },
      viewState: VIEW_STATE.VIEW_ONLY
    } as VehicleTechRecordState;

    const action = new SetSelectedVehicleTechnicalRecord(vehicleRecordState);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordActions.SetSelectedVehicleTechnicalRecord,
      vehicleRecordState
    });
  });
});

describe('SetViewState', () => {
  it('should create SetViewState action', () => {
    const viewState: VIEW_STATE = VIEW_STATE.EDIT;

    const action = new SetViewState(viewState);

    expect({ ...action }).toEqual({
      type: EVehicleTechRecordActions.SetViewState,
      viewState
    });
  });
});


