import { DefectAdditionalInformation } from '@api/test-results';
import { DefectAdditionalInformationLocation } from '@models/test-results/defectAdditionalInformationLocation';
import { DeficiencyCategoryEnum, TestResultDefect } from '../app/models/test-results/test-result-defect.model';

export const mockDefectList = (items = 1) => new Array(items).fill(0).map((_, i) => mockDefect(i));

export const mockDefect = (i = 0, data: Partial<TestResultDefect> = {}): TestResultDefect => ({
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
  ...data,
});

export const mockDefectAdditionalInformation = (i = 0): DefectAdditionalInformation => ({
  location: mockDefectLocation(i),
  notes: 'Defect notes',
});

export const mockDefectLocation = (i = 0): DefectAdditionalInformationLocation => ({
  seatNumber: i + 1,
  rowNumber: i + 1,
});
