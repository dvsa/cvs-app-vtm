import { ActionReducerMap } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';

import { IAppState } from '@app/store/state/app.state';
import { VehicleTechRecordReducers } from './VehicleTechRecordModel.reducers';
import { VehicleTestResultReducers } from './VehicleTestResult.reducers';
import { LoaderReducer } from './Loader.reducers';
import { ErrorReducer } from './error.reducers';
import { ReferenceDataReducers } from '@app/store/reducers/ReferenceData.reducers';
import { AppFormStateReducer } from './app-form-state.reducers';
import { ModalReducer } from '../../modal/modal.reducer';

export const appReducers: ActionReducerMap<IAppState> = {
  router: routerReducer,
  loader: LoaderReducer,
  vehicleTechRecordModel: VehicleTechRecordReducers,
  vehicleTestResultModel: VehicleTestResultReducers,
  referenceData: ReferenceDataReducers,
  error: ErrorReducer,
  appFormState: AppFormStateReducer,
  modalState: ModalReducer
};
