import { TestResultDefect } from '../app/models/test-results/test-result-defect.model';
import { AdditionalInformation } from '@models/defects/defectAdditionalInformation';
import { DefectAdditionalInformationLocation } from '@models/test-results/defectAdditionalInformationLocation';
import { createMock, createMockList } from 'ts-auto-mock';

export const mockDefectList = (numberOfDefects = 1) =>
  createMockList<TestResultDefect>(numberOfDefects, i => {
    return mockDefect(i);
  });

export const mockDefect = (i = 0) =>
  createMock<TestResultDefect>({
    deficiencyRef: `DeficiencyRef${i}`,
    deficiencyCategory: TestResultDefect.DeficiencyCategoryEnum.Dangerous,
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
    additionalInformation: mockDefectAdditionalInformation(i)
  });

export const mockDefectAdditionalInformation = (i = 0) =>
  createMock<AdditionalInformation>({
    location: mockDefectLocation(i),
    notes: 'Defect notes'
  });

export const mockDefectLocation = (i = 0) =>
  createMock<DefectAdditionalInformationLocation>({
    seatNumber: i + 1,
    rowNumber: i + 1
  });
