import { Tank } from './Tank';
import { AdditionalNotes } from './AdditionalNotes';
import { VehicleDetails } from "./VehicleDetails";
export interface AdrDetails {
  memosApplyFe?: (string)[] | null;
  tank: Tank;
  additionalNotes: AdditionalNotes;
  permittedDangerousGoodsFe?: (string)[] | null;
  vehicleDetails: VehicleDetails;
}
