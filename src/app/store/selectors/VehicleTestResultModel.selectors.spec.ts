import {
  getCurrentState,
  selectFeature,
  selectSelectedVehicleTestResultModel,
  selectTestTypeById
} from '@app/store/selectors/VehicleTestResultModel.selectors';
import { TestResultModel } from '@app/models/test-result.model';
import { TestType } from '@app/models/test.type';
import { select } from '@ngrx/store';

describe('vehicleTestResultModel selectors', () => {
  const createState = ({
    vehicleTestResultModel = {
      vehicleTestResultModel: [
        { testTypes: [{} as TestType] } as TestResultModel,
        { testTypes: [{} as TestType] } as TestResultModel
      ],
      editState: 0,
      selectedTestResultModel: null
    }
  } = {}) => ({
    vehicleTestResultModel: {
      vehicleTestResultModel
    }
  });

  it('selectFeature', () => {
    const state = createState();
    expect(selectFeature(state)).toMatchObject(state.vehicleTestResultModel);
  });

  it('selectSelectedVehicleTestResultModel', () => {
    const state = createState();
    expect(selectSelectedVehicleTestResultModel(state)).toMatchObject(
      state.vehicleTestResultModel.vehicleTestResultModel
    );
  });

  it('selectTestTypeById', () => {
    const state = createState();
    const testRes = state.vehicleTestResultModel.vehicleTestResultModel.vehicleTestResultModel;
    select(selectTestTypeById('1'));
    expect(Object.keys(testRes)).toHaveLength(2);
    Object.keys(testRes).forEach((res) => {
      expect(testRes[res].testTypes).toHaveLength(1);
      // spyOn(testRes[res].testTypes, 'some');
      // expect(testRes[res].testTypes.some).toHaveBeenCalled();
    });
    expect(state.vehicleTestResultModel).toBeTruthy();
  });

  it('getCurrentState', () => {
    const state = createState();
    const testRes = state.vehicleTestResultModel.vehicleTestResultModel;
    expect(getCurrentState(selectFeature(state))).toBe(testRes.editState);
  });
});
