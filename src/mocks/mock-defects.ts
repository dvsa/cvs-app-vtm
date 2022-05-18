import { Defect } from '../app/models/defect';
import { DefectAdditionalInformation } from '@models/defectAdditionalInformation';
import { DefectAdditionalInformationLocation } from '@models/defectAdditionalInformationLocation';
import { createMock, createMockList } from 'ts-auto-mock';

export const mockDefectList = (numberOfDefects = 1) =>
  createMockList<Defect>(numberOfDefects, (i) => {
    return mockDefect(i);
  });

export const mockDefect = (i = 0) =>
  createMock<Defect>({
    deficiencyRef: `DeficiencyRef${i}`,
    deficiencyCategory: Defect.DeficiencyCategoryEnum.Advisory,
    deficiencyId: 'deficiency ID',
    deficiencySubId: 'deficiency dub ID',
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
  createMock<DefectAdditionalInformation>({
    location: mockDefectLocation(i),
    notes: 'Defect notes'
  });

export const mockDefectLocation = (i = 0) =>
  createMock<DefectAdditionalInformationLocation>({
    seatNumber: i + 1,
    rowNumber: i + 1
  });
