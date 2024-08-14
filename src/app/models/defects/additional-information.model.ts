import { Location } from './location.model';

export interface AdditionalInformation {
	hgv?: AdditionalInfoSection;
	psv?: AdditionalInfoSection;
	trl?: AdditionalInfoSection;
}

export interface AdditionalInfoSection {
	location: Location;
	notes: boolean;
}
