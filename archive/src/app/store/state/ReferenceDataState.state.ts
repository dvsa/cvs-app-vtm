import { Preparer } from '@app/models/preparer';
import { TestStation } from '@app/models/test-station';
import { TestTypeCategory } from '@app/models/test-type-category';

export interface ReferenceDataState {
  preparers: Preparer[];
  testStations: TestStation[];
  testTypeCategories: TestTypeCategory[];
}

export const initialReferenceDataState: ReferenceDataState = {
  preparers: null,
  testStations: null,
  testTypeCategories: null
};
