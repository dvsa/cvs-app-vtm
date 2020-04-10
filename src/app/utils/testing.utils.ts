import { FormGroupDirective, FormGroup } from '@angular/forms';

import {
  ApplicantDetails,
  AdrDetails,
  VehicleDetails,
  AdditionalNotes
} from './../models/adr-details';
import { TechRecord, Applicant, Microfilm, Plate } from './../models/tech-record.model';
import { Tank, Tc2Details, Tc3Details, TankDetails } from '@app/models/Tank';
import { MetaData } from '@app/models/meta-data';

/**
 * *******************SOME GROUND RULES*************************************
 *
 *
 * We use this util file essentially for unit testing to enable a clean mock object provision
 * for our unit testing. Ideally more simplified object should/can be added.
 * Amendments of returned object should be done less often or not at ALL. We use
 * partial<T> object implementation hence the required object update(s) should be
 * passed in from the specific unit test of interest.
 *
 */

export const TESTING_UTILS = {
  mockApplicantDetails,
  mockFormGroupDirective,
  mockVehicleDetails,
  mockAdrDetails,
  mockTank,
  mockTankDetails,
  mockTc2Details,
  mockTc3Details,
  mockMetaData,
  mockTechRecord,
  mockApplicant,
  mockMicrofilm,
  mockPlates
};

function mockFormGroupDirective(): FormGroupDirective {
  const fgd: FormGroupDirective = new FormGroupDirective([], []);
  fgd.form = new FormGroup({});
  return fgd;
}

function mockApplicantDetails(args?: Partial<ApplicantDetails>): ApplicantDetails {
  const mock: ApplicantDetails = {
    name: 'Ben',
    street: 'Robert green',
    city: 'Birmingham',
    town: 'lala land',
    postcode: 'NG4 12Z'
  };

  return { ...mock, ...args };
}

function mockVehicleDetails(args?: Partial<VehicleDetails>): VehicleDetails {
  const mock: VehicleDetails = {
    approvalDate: '2020-03-10',
    type: 'centre axle battery'
  };

  return { ...mock, ...args };
}

function mockAdditionalNotes(args?: Partial<AdditionalNotes>): AdditionalNotes {
  const mock: AdditionalNotes = {
    number: [],
    guidanceNotes: []
  };

  return { ...mock, ...args };
}

function mockTc2Details(args?: Partial<Tc2Details>): Tc2Details {
  const mock: Tc2Details = {
    tc2IntermediateApprovalNo: 'tank123',
    tc2IntermediateExpiryDate: '2020-03-18',
    tc2Type: 'initial'
  };

  return { ...mock, ...args };
}

function mockTc3Details(args?: Partial<Tc3Details>): Tc3Details {
  const mock: Tc3Details = {
    tc3PeriodicExpiryDate: '2018-04-10',
    tc3Type: 'intermediate',
    tc3PeriodicNumber: 'tank124'
  };

  return { ...mock, ...args };
}

function mockTankDetails(args?: Partial<TankDetails>): TankDetails {
  const mock: TankDetails = {
    yearOfManufacture: 1998,
    specialProvisions: '',
    tankManufacturerSerialNo: '',
    tankCode: 'code',
    tankTypeAppNo: '',
    tankManufacturer: 'Marc',
    tc2Details: {} as Tc2Details,
    tc3Details: [] as Tc3Details[]
  };

  return { ...mock, ...args };
}

function mockTank(args?: Partial<Tank>): Tank {
  const mock: Tank = {
    tankDetails: mockTankDetails(),
    tankStatement: {
      statement: null,
      productListRefNo: null,
      substancesPermitted: '',
      productListUnNo: [],
      productList: ''
    }
  };

  return { ...mock, ...args };
}

function mockAdrDetails(args?: Partial<AdrDetails>): AdrDetails {
  const mock: AdrDetails = {
    vehicleDetails: mockVehicleDetails(),
    listStatementApplicable: false,
    batteryListNumber: '',
    declarationsSeen: false,
    brakeDeclarationsSeen: false,
    brakeDeclarationIssuer: '',
    brakeEndurance: false,
    weight: '',
    compatibilityGroupJ: false,
    documents: [],
    permittedDangerousGoods: ['AT'],
    additionalExaminerNotes: '',
    applicantDetails: mockApplicantDetails(),
    memosApply: [],
    additionalNotes: mockAdditionalNotes(),
    adrTypeApprovalNo: ''
  } as AdrDetails;

  return { ...mock, ...args };
}

function mockTechRecord(args?: Partial<TechRecord>): TechRecord {
  const mock: TechRecord = {
    statusCode: 'provisional',
    adrDetails: mockAdrDetails()
  } as TechRecord;

  return { ...mock, ...args };
}

function mockMetaData(): MetaData {
  return {
    adrDetails: {
      memosApplyFe: ['07/09 3mth leak ext'],
      tank: {
        tankStatement: {
          substancesPermittedFe: [
            'Substances permitted under the tank code and any special provisions specified in 9 may be carried',
            'Substances (Class UN number and if necessary packing group and proper shipping name) may be carried'
          ]
        }
      },
      additionalNotes: {
        guidanceNotesFe: ['New certificate requested'],
        numberFe: ['V1B', 'T1B']
      },
      permittedDangerousGoodsFe: ['FP <61 (FL)', 'AT', 'Explosives (type 2)'],
      vehicleDetails: {
        typeFe: [
          'Artic tractor',
          'Semi trailer battery',
          'Centre axle tank',
          'Centre axle battery'
        ]
      }
    }
  };
}

function mockApplicant(args?: Partial<Applicant>): Applicant {
  const mock: Applicant = {
    name: 'Ben',
    address1: 'Robert green',
    address2: 'Birmingham',
    postTown: 'lala land',
    address3: 'MyCounty',
    postCode: 'AC 123',
    emailAddress: 'test@test.com',
    telephoneNumber: '0207777777'
  };
  return { ...mock, ...args };
}

function mockMicrofilm(args?: Partial<Microfilm>): Microfilm {
  const mock: Microfilm = {
    microfilmDocumentType: 'PSV Miscellaneous',
    microfilmRollNumber: '1234',
    microfilmSerialNumber: '5678'
  };
  return { ...mock, ...args };
}

function mockPlates(args?: Partial<Plate>): Plate {
  const mock: Plate = {
    plateSerialNumber: '123123',
    plateIssueDate: '2019-12-13',
    plateReasonForIssue: '5678',
    plateIssuer: 'Issuer1'
  };
  return { ...mock, ...args };
}
