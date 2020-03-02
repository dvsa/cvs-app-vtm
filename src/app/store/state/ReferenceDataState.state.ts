import { Preparer } from '@app/models/preparer';
import { TestStation } from '@app/models/test-station';

export interface IReferenceDataState {
  preparers: Preparer[];
  testStations: TestStation[];
}

export const initialReferenceDataState: IReferenceDataState = {
  preparers: null,
  testStations: null
};
