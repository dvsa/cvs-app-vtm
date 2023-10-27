import { DefectAdditionalInformation } from '@api/test-results';
import { DefectAdditionalInformationLocation } from '@models/test-results/defectAdditionalInformationLocation';
// disable linting error as this util function is only used in tests and should, therefore, be a devDependency
// eslint-disable-next-line import/no-extraneous-dependencies
import { createMock, createMockList } from 'ts-auto-mock';
import { DeficiencyCategoryEnum, TestResultDefect } from '../app/models/test-results/test-result-defect.model';

export const mockDefectList = (numberOfDefects = 1) =>
  createMockList<TestResultDefect>(numberOfDefects, (i) => {
    return mockDefect(i);
  });

export const mockDefect = (i = 0) =>
  createMock<TestResultDefect>({
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

export const mockDefectAdditionalInformation = (i = 0) =>
  createMock<DefectAdditionalInformation>({
    location: mockDefectLocation(i),
    notes: 'Defect notes',
  });

export const mockDefectLocation = (i = 0) =>
  createMock<DefectAdditionalInformationLocation>({
    seatNumber: i + 1,
    rowNumber: i + 1,
  });
