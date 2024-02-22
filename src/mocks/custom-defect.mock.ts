import { CustomDefects } from '@models/test-types/test-type.model';

export const createMockCustomDefect = (params: Partial<CustomDefects> = {}): CustomDefects => ({
  referenceNumber: 'referenceNumber',
  defectName: 'defectName',
  defectNotes: 'defectNotes',
  ...params,
});
