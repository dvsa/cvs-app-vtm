import { GlobalError } from '@core/components/global-error/global-error.interface';
import { createAction, props } from '@ngrx/store';
import { VehicleTechRecordModel } from '../../../models/vehicle-tech-record.model';

export const getByVIN = createAction('[Technical Record Service] GetByVIN', props<{ vin: string }>());
export const getByVINSuccess = createAction('[Technical Record Service] GetByVIN Success', props<{ vehicleTechRecords: Array<VehicleTechRecordModel> }>());
export const getByVINFailure = createAction('[Technical Record Service] GetByVIN Failure', props<GlobalError>());
