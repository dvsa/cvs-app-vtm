import {
  selectFeature,
  selectSelectedVehicleTechRecordModel,
  selectVehicleTechRecordModelHavingStatusAll
} from '@app/store/selectors/VehicleTechRecordModel.selectors';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';
import { CreateTechRecordVM } from '@app/store/state/VehicleTechRecordModel.state';

describe('vehicleTechRecordModel selectors', () => {
  const createState = ({
    vehicleTechRecordModel = {
      initialDetails: {} as CreateTechRecordVM,
      vehicleTechRecordModel: {} as VehicleTechRecordModel,
      selectedVehicleTechRecordModel: {} as VehicleTechRecordModel
    }
  } = {}) => ({
    vehicleTechRecordModel: {
      vehicleTechRecordModel
    }
  });

  it('selectFeature', () => {
    const state = createState();
    expect(selectFeature(state)).toMatchObject(state.vehicleTechRecordModel);
  });

  it('selectVehicleTechRecordModelHavingStatusAll', () => {
    const state = createState();
    expect(selectVehicleTechRecordModelHavingStatusAll(state)).toMatchObject(
      state.vehicleTechRecordModel.vehicleTechRecordModel
    );
  });

  it('selectSelectedVehicleTechRecordModel', () => {
    const state = createState();
    expect(selectSelectedVehicleTechRecordModel(selectFeature(state))).toMatchObject({});
  });
});
