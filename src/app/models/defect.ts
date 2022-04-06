interface Location {
  axleNumber?: number;
  horizontal?: string;
  vertical: string;
  longitudinal?: string;
  rowNumber: number;
  lateral: string;
  seatNumber: number;
}

interface AdditionalInformation {
  location: Location;
  notes: string;
}

export interface Defect {
  prohibitionIssued: boolean;
  additionalInformation: AdditionalInformation;
  itemNumber: number;
  deficiencyRef: string;
  stdForProhibition: boolean;
  deficiencyId: string;
  imNumber: number;
  deficiencyCategory: string;
  deficiencyText: string;
  prs: boolean;
  deficiencySubId?: any;
  imDescription: string;
  itemDescription: string;
}
