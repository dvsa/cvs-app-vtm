import {IAppState} from '@app/store/state/app.state';
import {initialVehicleTestResultModelState, IVehicleTestResultModelState} from '../../store/state/VehicleTestResultModel.state';
import {EVehicleTestResultModelActions, VehicleTestResultModelActions} from '../../store/actions/VehicleTestResultModel.actions';

export function VehicleTestResultModelReducers(state = initialVehicleTestResultModelState, action: VehicleTestResultModelActions):
  IVehicleTestResultModelState {
  switch (action.type) {
    case EVehicleTestResultModelActions.GetVehicleTestResultModelSuccess: {
      return {
        ...state,
        selectedTestResultModel: action.payload
      };
    }

    default:
      return state;
  }
}
