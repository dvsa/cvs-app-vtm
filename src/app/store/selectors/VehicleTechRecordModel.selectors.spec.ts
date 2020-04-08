import { TechRecord } from '@app/models/tech-record.model';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import {
  getSelectedVehicleTechRecord,
  getTechRecord,
  getVehicleTechRecordMetaData,
  getViewState
} from './VehicleTechRecordModel.selectors';
import { RECORD_STATUS, VIEW_STATE } from '@app/app.enums';

const getVehicleTechModel = () => {
  return {
    systemNumber: '11008',
    techRecord: [
      {
        statusCode: RECORD_STATUS.CURRENT,
        createdAt: '2019-06-26T10:26:54.903Z'
      },
      {
        statusCode: RECORD_STATUS.ARCHIVED,
        createdAt: '2019-06-26T10:26:00.903Z'
      }
    ],
    vin: 'ABCDEFGH654321',
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
    // TODO: Initialization test waiting for bug 12898 to be merged
    // expect(getSelectedVehicleTechRecord.projector(initialErrorState)).toEqual([]);
  });

  it('should return selected vehicle tech record in state', () => {
    expect(getSelectedVehicleTechRecord.projector({ selectedVehicleTechRecord })).toEqual(
      getVehicleTechModel()
    );
  });

  it('should return the given techRecord from list of tech records', () => {
    const expectedTechRecord = getVehicleTechModel().techRecord[0];
    expect(getTechRecord.projector(selectedVehicleTechRecord)(expectedTechRecord)).toEqual(
      expectedTechRecord
    );
  });

  it('should return the active techRecord from list of tech records', () => {
    const expectedTechRecord = getVehicleTechModel().techRecord[0];
    expect(getTechRecord.projector(selectedVehicleTechRecord)()).toEqual(expectedTechRecord);
  });

  it('should return the latest techRecord from list of archived tech records', () => {
    const archivedTechRecords = [
      {
        statusCode: RECORD_STATUS.ARCHIVED,
        createdAt: '2020-06-26T10:26:00.903Z'
      },
      {
        statusCode: RECORD_STATUS.ARCHIVED,
        createdAt: '2020-06-26T10:26:10.803Z'
      }
    ] as TechRecord[];

    const vehicleTechRecord = {
      ...selectedVehicleTechRecord,
      techRecord: archivedTechRecords
    } as VehicleTechRecordModel;

    expect(getTechRecord.projector(vehicleTechRecord)()).toEqual({
      statusCode: RECORD_STATUS.ARCHIVED,
      createdAt: '2020-06-26T10:26:10.803Z'
    });
  });

  describe('getVehicleTechRecordMetaData', () => {
    it('should return the metaData on vehicle tech record', () => {
      expect(getVehicleTechRecordMetaData.projector(selectedVehicleTechRecord)).toEqual(
        getVehicleTechModel().metadata
      );
    });
  });

  describe('getViewState', () => {
    it('should return the current view state', () => {
      const viewState = VIEW_STATE.VIEW_ONLY;
      expect(getViewState.projector({ viewState })).toEqual(VIEW_STATE.VIEW_ONLY);
    });
  });
});
