import { DeficiencyCategoryEnum } from '../app/models/test-results/test-result-defect.model';

export const mockDefectList = (numberOfDefects = 1) => new Array(numberOfDefects).fill(0).map((_, i) => mockDefect(i));

export const mockDefect = (i = 0) => ({
  deficiencyRef: `DeficiencyRef${i}`,
  deficiencyCategory: DeficiencyCategoryEnum.Dangerous,
  deficiencyId: 'deficiency ID',
  deficiencySubId: 'deficiency sub ID',
  deficiencyText: 'deficiency text',
  imDescription: 'IM description',
  imNumber: 34,
  itemDescription: 'item description',
  itemNumber: 6,
  prohibitionIssued: false,
  prs: false,
  stdForProhibition: false,
  additionalInformation: mockDefectAdditionalInformation(i),
});

export const mockDefectAdditionalInformation = (i = 0) => ({
  location: mockDefectLocation(i),
  notes: 'Defect notes',
});

export const mockDefectLocation = (i = 0) => ({
  seatNumber: i + 1,
  rowNumber: i + 1,
});
