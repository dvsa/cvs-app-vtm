// @TODO: replace with enum from @dvsa/cvs-type-definitions (note: v12.1.0 contains a typo, so use a higher version)
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

// @TODO: replace with enum from @dvsa/cvs-type-definitions when added
export enum ModTypeCode {
	p = 'p',
	m = 'm',
	g = 'g',
}

// @TODO: replace with enum from @dvsa/cvs-type-definitions when added
export enum ModeTypeDescription {
	ParticulateTrap = 'particulate trap',
	Engine = 'modification or change of engine',
	GasEngine = 'gas engine',
}

// @TODO: replace with interface from @dvsa/cvs-type-definitions when added
export interface ModType {
	code: ModTypeCode;
	description: ModeTypeDescription;
}
