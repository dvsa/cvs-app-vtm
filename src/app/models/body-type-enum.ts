// The types and codes need to be lowercase for the API.

export enum BodyTypeDescription {
	ARTIC = 'artic',
	ARTICULATED = 'articulated',
	BOX = 'box',
	CAR_TRANSPORTER = 'car transporter',
	CONCRETE_MIXER = 'concrete mixer',
	CURTAINSIDER = 'curtainsider',
	DOUBLE_DECKER = 'double decker',
	FLAT = 'flat',
	LIVESTOCK_CARRIER = 'livestock carrier',
	LOW_LOADER = 'low loader',
	MINI_BUS = 'mini bus',
	OTHER = 'other',
	OTHER_TANKER = 'other tanker',
	PETROL_OR_OIL_TANKER = 'petrol/oil tanker',
	REFUSE = 'refuse',
	REFRIGERATED = 'refrigerated',
	SINGLE_DECKER = 'single decker',
	SKELETAL = 'skeletal',
	SKIP_LOADER = 'skip loader',
	TIPPER = 'tipper',
	TRACTOR = 'tractor',
}

export enum BodyTypeCode {
	A = 'a',
	B = 'b',
	C = 'c',
	D = 'd',
	E = 'e',
	F = 'f',
	I = 'i',
	K = 'k',
	L = 'l',
	M = 'm',
	O = 'o',
	P = 'p',
	R = 'r',
	S = 's',
	T = 't',
	U = 'u',
	X = 'x',
	Y = 'y',
}

const commonBodyTypeCodeMap = new Map<BodyTypeCode, BodyTypeDescription>([
	[BodyTypeCode.B, BodyTypeDescription.BOX],
	[BodyTypeCode.C, BodyTypeDescription.REFRIGERATED],
	[BodyTypeCode.D, BodyTypeDescription.DOUBLE_DECKER],
	[BodyTypeCode.E, BodyTypeDescription.CURTAINSIDER],
	[BodyTypeCode.F, BodyTypeDescription.FLAT],
	[BodyTypeCode.I, BodyTypeDescription.LIVESTOCK_CARRIER],
	[BodyTypeCode.K, BodyTypeDescription.SKELETAL],
	[BodyTypeCode.O, BodyTypeDescription.OTHER_TANKER],
	[BodyTypeCode.P, BodyTypeDescription.PETROL_OR_OIL_TANKER],
	[BodyTypeCode.S, BodyTypeDescription.SKIP_LOADER],
	[BodyTypeCode.T, BodyTypeDescription.TIPPER],
	[BodyTypeCode.X, BodyTypeDescription.OTHER],
	[BodyTypeCode.Y, BodyTypeDescription.CAR_TRANSPORTER],
]);

const psvBodyTypeCodeMap = new Map<BodyTypeCode, BodyTypeDescription>([
	[BodyTypeCode.A, BodyTypeDescription.ARTICULATED],
	[BodyTypeCode.D, BodyTypeDescription.DOUBLE_DECKER],
	[BodyTypeCode.M, BodyTypeDescription.MINI_BUS],
	[BodyTypeCode.S, BodyTypeDescription.SINGLE_DECKER],
	[BodyTypeCode.O, BodyTypeDescription.OTHER],
]);

export const hgvBodyTypeCodeMap = new Map<BodyTypeCode, BodyTypeDescription>([
	[BodyTypeCode.B, BodyTypeDescription.BOX],
	[BodyTypeCode.C, BodyTypeDescription.REFRIGERATED],
	[BodyTypeCode.E, BodyTypeDescription.CURTAINSIDER],
	[BodyTypeCode.F, BodyTypeDescription.FLAT],
	[BodyTypeCode.I, BodyTypeDescription.LIVESTOCK_CARRIER],
	[BodyTypeCode.K, BodyTypeDescription.SKELETAL],
	[BodyTypeCode.O, BodyTypeDescription.OTHER_TANKER],
	[BodyTypeCode.P, BodyTypeDescription.PETROL_OR_OIL_TANKER],
	[BodyTypeCode.S, BodyTypeDescription.SKIP_LOADER],
	[BodyTypeCode.T, BodyTypeDescription.TIPPER],
	[BodyTypeCode.X, BodyTypeDescription.OTHER],
	[BodyTypeCode.Y, BodyTypeDescription.CAR_TRANSPORTER],
	[BodyTypeCode.A, BodyTypeDescription.TRACTOR],
	[BodyTypeCode.L, BodyTypeDescription.LOW_LOADER],
	[BodyTypeCode.M, BodyTypeDescription.CONCRETE_MIXER],
	[BodyTypeCode.R, BodyTypeDescription.REFUSE],
]);

export const trlBodyTypeCodeMap = new Map<BodyTypeCode, BodyTypeDescription>([
	...commonBodyTypeCodeMap.entries(),
	[BodyTypeCode.L, BodyTypeDescription.LOW_LOADER],
]);

export const articulatedHgvBodyTypeCodeMap = new Map<BodyTypeCode, BodyTypeDescription>([
	[BodyTypeCode.A, BodyTypeDescription.ARTICULATED],
]);

export const vehicleBodyTypeCodeMap = new Map<string, Map<BodyTypeCode, BodyTypeDescription>>([
	['psv', psvBodyTypeCodeMap],
	['rigidHgv', hgvBodyTypeCodeMap],
	['trl', trlBodyTypeCodeMap],
	['articulatedHgv', articulatedHgvBodyTypeCodeMap],
]);

export const vehicleBodyTypeDescriptionMap = new Map<string, Map<BodyTypeDescription, BodyTypeCode>>([
	['psv', new Map([...psvBodyTypeCodeMap.entries()].map(([k, v]) => [v, k]))],
	['trl', new Map([...trlBodyTypeCodeMap.entries()].map(([k, v]) => [v, k]))],
	['rigidHgv', new Map([...hgvBodyTypeCodeMap.entries()].map(([k, v]) => [v, k]))],
	['articulatedHgv', new Map([...articulatedHgvBodyTypeCodeMap.entries()].map(([k, v]) => [v, k]))],
]);
