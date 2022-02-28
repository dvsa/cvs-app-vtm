interface Tank {
  tankStatement: TankStatement;
}

interface AdditionalNotes {
  numberFe: string[];
  guidanceNotesFe: string[];
}

interface TankStatement {
  substancesPermittedFe: string[];
}

interface VehicleDetails {
  typeFe: string[];
}

interface AdrDetails {
  memosApplyFe: string[];
  tank: Tank;
  additionalNotes: AdditionalNotes;
  permittedDangerousGoodsFe: string[];
  vehicleDetails: VehicleDetails;
}

export interface MetaData {
  adrDetails: AdrDetails;
}
