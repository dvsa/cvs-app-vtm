export interface Tc3Details {
  tc3Type: string;
  tc3PeriodicNumber: string;
  tc3PeriodicExpiryDate: string;
}

export interface Tc2Details {
  tc2Type: string;
  tc2IntermediateApprovalNo: string;
  tc2IntermediateExpiryDate: string;
}

export interface TankStatement {
  substancesPermitted: string;
  statement: string;
  productListRefNo: string;
  productListUnNo: string[];
  productList: string;
}

export interface TankDetails {
  tankManufacturer: string;
  yearOfManufacture: number;
  tankCode: string;
  specialProvisions: string;
  tankManufacturerSerialNo: string;
  tankTypeAppNo: string;
  tc2Details: Tc2Details;
  tc3Details: Tc3Details[];
}

export interface Tank {
  tankDetails: TankDetails;
  tankStatement: TankStatement;
}
