import { TestBed } from '@angular/core/testing';

import { BodyType } from '@app/models/body-type';
import { SelectOption } from '@app/models/select-option';
import { SUBSTANCES } from '@app/app.enums';
import { DocumentMetaData } from '../models/document-meta-data';
import { TechnicalRecordValuesMapper } from './technical-record-value.mapper';
import { VehicleTechRecordEdit } from '@app/models/vehicle-tech-record.model';

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
      substancesPermitted: SUBSTANCES.PERMITTED,
      productListUnNo: ['un1', 'un2', '']
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

const vehicleRecordControlValues = () => {
  return {
    techRecord: {
      adrDetails: {
        weight: '5000',
        permittedDangerousGoods: adrDetailsControlValues().permittedDangerousGoods,
        additionalNotes: adrDetailsControlValues().additionalNotes,
        tank: tankDetailsControlValues(),
        memosApply: true, // 07/09 3mth leak ext
        documents: tankDocumentControlValues()
      }
    }
  };
};

describe('TechnicalRecordValuesMapper', () => {
  let vehicleValueMapper: TechnicalRecordValuesMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TechnicalRecordValuesMapper]
    });

    vehicleValueMapper = TestBed.get(TechnicalRecordValuesMapper);
  });

  describe('mapControlValuesToDataValues', () => {
    it('should return null for ADR if not in TechRecord control values', () => {
      const vehicleRecord = {
        techRecord: {
          bodyType: {} as BodyType
        }
      };

      const result: VehicleTechRecordEdit = vehicleValueMapper.mapControlValuesToDataValues(
        vehicleRecord
      );
      expect(result.techRecord[0].adrDetails).toBeNull();
    });

    it('should map ADR control values in TechRecord to allowed values', () => {
      const result: VehicleTechRecordEdit = vehicleValueMapper.mapControlValuesToDataValues(
        vehicleRecordControlValues() as any
      );

      expect(result.techRecord[0].adrDetails).toMatchSnapshot();
    });
  });
});
