import { createAction, props } from '@ngrx/store';
import { TestResultModel } from '../../models/test-result.model';

export const getBySystemId = createAction('[Test Record Service] GetBySystemId', props<{ systemId: string; }>());
export const getBySystemIdSuccess = createAction('[Test Record Service] GetBySystemId Success', props<{ testRecords: TestResultModel[]; }>());
export const getBySystemIdFailure = createAction('[Test Record Service] GetBySystemId Failure', props<{ message: string; }>());
