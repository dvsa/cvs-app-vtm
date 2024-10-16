export enum FuelType {
	Diesel = 'diesel',
	GasCng = 'gas-cng',
	GasLng = 'gas-lng',
	GasLpg = 'gas-lpg',
	FuelCell = 'fuel cell',
	Petrol = 'petrol',
	FullElectric = 'full electric',
}

export enum EmissionStandard {
	EuroIVPM = '0.03 g/kWh Euro IV PM',
	Euro3 = 'Euro 3',
	Euro4 = 'Euro 4',
	Euro5 = 'Euro 5',
	Euro6 = 'Euro 6',
	EuroV = 'Euro V',
	EuroVI = 'Euro VI',
	FullElectric = 'Full Electric',
}

export enum ModTypeCode {
	p = 'p',
	m = 'm',
	g = 'g',
}

export enum ModeTypeDescription {
	ParticulateTrap = 'particulate trap',
	Engine = 'modification or change of engine',
	GasEngine = 'gas engine',
}

export interface ModType {
	code: ModTypeCode;
	description: ModeTypeDescription;
}
