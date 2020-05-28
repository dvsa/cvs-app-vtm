import { Preparer } from '@app/models/preparer';
import { TestStation } from '@app/models/test-station';

export interface ReferenceDataState {
  preparers: Preparer[];
  testStations: TestStation[];
}

export const initialReferenceDataState: ReferenceDataState = {
  preparers: null,
  testStations: null
};
