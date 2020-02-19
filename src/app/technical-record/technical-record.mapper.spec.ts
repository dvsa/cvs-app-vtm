import { TestBed } from '@angular/core/testing';

import { TechRecord } from '@app/models/tech-record.model';
import { SelectOption } from '@app/models/select-option';
import { SUBSTANCES } from '@app/app.enums';
import { DocumentMetaData } from '../models/document-meta-data';
import { TechnicalRecordValuesMapper } from './technical-record.mapper';
import { BodyType } from '@app/models/body-type';

const adrDetailsControlValues = () => {
  return {
    permittedDangerousGoods: [
      {
        name: 'Class 5.1 Hydrogen Peroxide (OX)',
        selected: true
      }
    ] as SelectOption[],
    additionalNotes: {
      number: [
        {
          name: '1A',
          selected: false
        }
      ] as SelectOption[],
      guidanceNotes: true // New Certificate requested
    }
  };
};

const tankDetailsControlValues = () => {
  return {
    tankStatement: {
      substancesPermitted: SUBSTANCES.PERMITTED
    }
  };
};

const tankDocumentControlValues = () => {
  return [
    {
      metaName: 'UUID_Filename',
      uuid: 'UUID'
    }
  ] as DocumentMetaData[];
};

const techRecordControlValues = () => {
  return {
    adrDetails: {
      permittedDangerousGoods: adrDetailsControlValues().permittedDangerousGoods,
      additionalNotes: adrDetailsControlValues().additionalNotes,
      tank: tankDetailsControlValues(),
      memosApply: true, // 07/09 3mth leak ext
      documents: tankDocumentControlValues()
    }
  };
};

describe('TechnicalRecordValuesMapper', () => {
  let techValueMapper: TechnicalRecordValuesMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TechnicalRecordValuesMapper]
    });

    techValueMapper = TestBed.get(TechnicalRecordValuesMapper);
  });

  describe('mapToAllowedValues', () => {
    it('should return null if ADR data is not in TechRecord control values', () => {
      const techRecord = {
        bodyType: {} as BodyType
      } as TechRecord;

      const result = techValueMapper.mapControlValuesToDataValues(techRecord);
      expect(result.adrDetails).toBeNull();
    });

    it('should map ADR control values in TechRecord to allowed values', () => {
      const result = techValueMapper.mapControlValuesToDataValues(
        techRecordControlValues() as any
      );

      expect(result.adrDetails).toMatchSnapshot();
    });
  });
});
