import { TechRecord } from '@app/models/tech-record.model';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import {
  getSelectedVehicleTechRecord,
  getVehicleTechRecordMetaData,
  getTechViewState,
  getActiveVehicleTechRecord
} from './VehicleTechRecordModel.selectors';
import { RECORD_STATUS, VIEW_STATE } from '@app/app.enums';
import { initialAppState } from '../state/app.state';
import { VrmModel } from '@app/models/vrm.model';

const getTechnicalRecords = (): TechRecord[] => {
  return [
    {
      statusCode: RECORD_STATUS.CURRENT,
      createdAt: '2019-06-26T10:26:54.903Z'
    },
    {
      statusCode: RECORD_STATUS.ARCHIVED,
      createdAt: '2019-06-26T10:26:00.903Z'
    }
  ] as TechRecord[];
};

const getVrms = (): VrmModel[] => {
  return [
    {
      vrm: 'LKJH654',
      isPrimary: true
    },
    {
      vrm: 'POI9876',
      isPrimary: false
    }
  ];
};

const getVehicleTechModel = () => {
  return {
    systemNumber: '11008',
    techRecord: getTechnicalRecords(),
    vin: 'ABCDEFGH654321',
    vrms: getVrms(),
    metadata: {
      adrDetails: {
        memosApplyFe: ['07/09 3mth leak ext']
      }
    }
  } as VehicleTechRecordModel;
};

describe('VehicleTechRecordModel selectors', () => {
  let selectedVehicleTechRecord: VehicleTechRecordModel;
  beforeEach(() => {
    selectedVehicleTechRecord = getVehicleTechModel();
  });

  it('should return the default state on initialization', () => {
    const { vehicleTechRecordModel } = initialAppState;
    expect(getSelectedVehicleTechRecord.projector(vehicleTechRecordModel)).toEqual(null);
  });

  it('should return selected vehicle tech record in state', () => {
    expect(getSelectedVehicleTechRecord.projector({ selectedVehicleTechRecord })).toEqual(
      getVehicleTechModel()
    );
  });

  it('should return the active vehicle Record', () => {
    expect(getActiveVehicleTechRecord.projector(selectedVehicleTechRecord)()).toMatchSnapshot();
  });

  it('should return the active vehicle Record with trailer Id', () => {
    const vehicleRecordTrailer = {
      ...selectedVehicleTechRecord,
      trailerId: '0285678'
    } as VehicleTechRecordModel;

    expect(getActiveVehicleTechRecord.projector(vehicleRecordTrailer)()).toMatchSnapshot();
  });

  it('should return the active vehicle Record with the preferred techRecord', () => {
    const givenTechRecord = getTechnicalRecords()[1];
    expect(
      getActiveVehicleTechRecord.projector(selectedVehicleTechRecord)(givenTechRecord)
    ).toMatchSnapshot();
  });

  it('should return the active vehicle Record with the latest techRecord from archives', () => {
    const archivedTechRecords = [
      {
        statusCode: RECORD_STATUS.ARCHIVED,
        createdAt: '2020-06-26T10:26:00.903Z'
      },
      {
        statusCode: RECORD_STATUS.ARCHIVED,
        createdAt: '2020-06-26T10:26:10.803Z' // expected in the result
      }
    ] as TechRecord[];

    const vehicleTechRecord = {
      ...selectedVehicleTechRecord,
      techRecord: archivedTechRecords
    } as VehicleTechRecordModel;

    expect(getActiveVehicleTechRecord.projector(vehicleTechRecord)()).toMatchSnapshot();
  });

  describe('getVehicleTechRecordMetaData', () => {
    it('should return the metaData on vehicle tech record', () => {
      expect(getVehicleTechRecordMetaData.projector(selectedVehicleTechRecord)).toEqual(
        getVehicleTechModel().metadata
      );
    });
  });

  describe('getTechViewState', () => {
    it('should return the current view state', () => {
      const viewState = VIEW_STATE.VIEW_ONLY;
      expect(getTechViewState.projector({ viewState })).toEqual(VIEW_STATE.VIEW_ONLY);
    });
  });
});
