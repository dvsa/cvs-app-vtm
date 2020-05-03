import { ActionReducerMap } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';

import { IAppState } from '@app/store/state/app.state';
import { VehicleTechRecordModelReducers } from './VehicleTechRecordModel.reducers';
import { VehicleTestResultModelReducers } from './VehicleTestResultModel.reducers';
import { LoaderReducer } from './Loader.reducers';
import { ErrorReducer } from './error.reducers';

export const appReducers: ActionReducerMap<IAppState> = {
  router: routerReducer,
  loader: LoaderReducer,
  vehicleTechRecordModel: VehicleTechRecordModelReducers,
  vehicleTestResultModel: VehicleTestResultModelReducers,
  error: ErrorReducer
};
