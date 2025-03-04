import { ApprovalType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/approvalType.enum.js';
import { EUVehicleCategory } from '@dvsa/cvs-type-definitions/types/v3/tech-record/enums/euVehicleCategory.enum.js';
import { VehicleType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/search';
import { ParagraphIds } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';
import { TechRecordType as TechRecordTypeByVehicle } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-vehicle-type';
import { TechRecordType } from '@dvsa/cvs-type-definitions/types/v3/tech-record/tech-record-verb';
import { BodyTypeCode, BodyTypeDescription } from './body-type-enum';

export interface VehicleTechRecordModel {
	vrms: Vrm[];
	vin: string;
	trailerId?: string;
	systemNumber: string;
	techRecord: TechRecordModel[];
}

export type V3TechRecordModel = TechRecordType<'get'> | TechRecordType<'put'>;

export type Empty<T> = { [key in keyof T]: T[key] | null };

export type VehiclesOtherThan<T extends VehicleType> = TechRecordTypeByVehicle<Exclude<VehicleType, T>>;

export type Axles<T extends 'hgv' | 'psv' | 'trl' = 'hgv' | 'psv' | 'trl'> = NonNullable<
	TechRecordTypeByVehicle<T>['techRecord_axles']
>;
export type Axle<T extends 'hgv' | 'psv' | 'trl' = 'hgv' | 'psv' | 'trl'> = Axles<T>[0];

export type BatchUpdateVehicleModel = TechRecordType<'put'> & {
	createdTimestamp: string;
	systemNumber?: string;
};

export interface PostNewVehicleModel extends Omit<VehicleTechRecordModel, 'vrms'> {
	primaryVrm?: string;
	secondaryVrms?: string[];
}

export interface Vrm {
	vrm: string;
	isPrimary: boolean;
}

export enum ReasonForEditing {
	CORRECTING_AN_ERROR = 'correcting-an-error',
	NOTIFIABLE_ALTERATION_NEEDED = 'notifiable-alteration-needed',
}

export enum StatusCodes {
	ARCHIVED = 'archived',
	CURRENT = 'current',
	PROVISIONAL = 'provisional',
}

export enum VehicleTypes {
	PSV = 'psv',
	HGV = 'hgv',
	TRL = 'trl',
	LGV = 'lgv',
	CAR = 'car',
	SMALL_TRL = 'small trl',
	MOTORCYCLE = 'motorcycle',
}

export enum TrailerFormType {
	TES1 = 'tes1',
	TES2 = 'tes2',
}

export enum FuelTypes {
	DIESELPETROL = 'DieselPetrol',
	DIESEL = 'Diesel',
	PETROL = 'Petrol',
	HYBRID = 'Hybrid',
	ELECTRIC = 'Electric',
	CNG = 'CNG',
	FUELCELL = 'Fuel cell',
	LNG = 'LNG',
	OTHER = 'Other',
}

export enum VehicleConfigurations {
	RIGID = 'rigid',
	ARTICULATED = 'articulated',
	CENTRE_AXLE_DRAWBAR = 'centre axle drawbar',
	SEMI_CAR_TRANSPORTER = 'semi-car transporter',
	SEMI_TRAILER = 'semi-trailer',
	LOW_LOADER = 'low loader',
	OTHER = 'other',
	DRAWBAR = 'drawbar',
	FOUR_IN_LINE = 'four-in-line',
	DOLLY = 'dolly',
	FULL_DRAWBAR = 'full drawbar',
	LONG_SEMI_TRAILER = 'long semi-trailer',
}

export enum FrameDescriptions {
	CHANNEL_SECTION = 'Channel section',
	SPACE_FRAME = 'Space frame',
	I_SECTION = 'I section',
	TUBULAR = 'Tubular',
	FRAME_SECTION = 'Frame section',
	OTHER = 'Other',
	INTEGRAL = 'integral',
	BOX_SECTION = 'Box section',
	U_SECTION = 'U section',
}

export enum VehicleSizes {
	SMALL = 'small',
	LARGE = 'large',
}

export enum VehicleSubclass {
	N = 'n',
	P = 'p',
	A = 'a',
	S = 's',
	C = 'c',
	L = 'l',
	T = 't',
	E = 'e',
	M = 'm',
	R = 'r',
	W = 'w',
}

export interface LettersOfAuth {
	letterType: string;
	paragraphId: ParagraphIds;
	letterIssuer: string;
	letterDateRequested: string;
	letterContents: string;
}

export enum LettersIntoAuthApprovalType {
	GB_WVTA = 'GB WVTA',
	UKNI_WVTA = 'UKNI WVTA',
	EU_WVTA_PRE_23 = 'EU WVTA Pre 23',
	EU_WVTA_23_ON = 'EU WVTA 23 on',
	QNIG = 'QNIG',
	PROV_GB_WVTA = 'Prov.GB WVTA',
	SMALL_SERIES_NKSXX = 'Small series NKSXX',
	SMALL_SERIES_NKS = 'Small series NKS',
	IVA_VCA = 'IVA - VCA',
	IVA_DVSA_NI = 'IVA - DVSA/NI',
}

export enum ParagraphId {
	PARAGRAPH_3 = 3,
	PARAGRAPH_4 = 4,
	PARAGRAPH_5 = 5,
	PARAGRAPH_6 = 6,
	PARAGRAPH_7 = 7,
}

export enum SpeedCategorySymbol {
	A7 = 'a7',
	A8 = 'a8',
	B = 'b',
	C = 'c',
	D = 'd',
	E = 'e',
	F = 'f',
	G = 'g',
	J = 'j',
	K = 'k',
	L = 'l',
	M = 'm',
	N = 'n',
	P = 'p',
	Q = 'q',
}

export enum FitmentCode {
	SINGLE = 'single',
	DOUBLE = 'double',
}

export interface Tyres {
	tyreCode?: number | null;
	tyreSize?: string | null;
	plyRating?: string | null;
	fitmentCode?: FitmentCode | null;
	speedCategorySymbol?: SpeedCategorySymbol | null;
	dataTrAxles?: number | null;
}

export class Tyre implements Tyres {
	tyreSize!: string | null;
	speedCategorySymbol!: SpeedCategorySymbol | null;
	fitmentCode!: FitmentCode | null;
	dataTrAxles!: number | null;
	plyRating!: string | null;
	tyreCode!: number | null;

	constructor(tyre: Tyres) {
		Object.assign(this, tyre);
	}
}

export interface AxleWeights {
	kerbWeight?: number | null;
	ladenWeight?: number | null;
	gbWeight?: number | null;
	eecWeight?: number | null;
	designWeight?: number | null;
}

export interface Purchaser {
	name?: string;
	address1?: string;
	address2?: string;
	postTown?: string;
	address3?: string | null;
	postCode?: string | null;
	telephoneNumber?: string | null;
	emailAddress?: string | null;
	faxNumber?: string | null;
	purchaserNotes?: string | null;
}

export interface BodyType {
	description?: BodyTypeDescription;
	code?: BodyTypeCode;
}

export interface TechRecordModel {
	historicVin?: string;
	historicPrimaryVrm?: string;
	historicSecondaryVrms?: string[];
	createdAt: Date;
	createdByName?: string;
	statusCode?: StatusCodes;
	vehicleType: VehicleTypes;
	regnDate?: string;
	firstUseDate?: string;
	manufactureYear?: number;
	noOfAxles?: number;
	axles?: Axle[];
	suspensionType?: string;
	speedRestriction?: number;
	speedLimiterMrk?: boolean;
	tachoExemptMrk?: boolean;
	euroStandard?: string;
	roadFriendly?: boolean;
	fuelPropulsionSystem?: FuelTypes;
	drawbarCouplingFitted?: boolean;
	vehicleClass?: {
		description: string;
		code: string;
	};
	vehicleConfiguration?: VehicleConfigurations | null;
	couplingType?: string;
	maxLoadOnCoupling?: number;
	frameDescription?: FrameDescriptions;
	offRoad?: boolean;
	numberOfWheelsDriven?: number;
	euVehicleCategory?: EUVehicleCategory;
	emissionsLimit?: number;
	seatsLowerDeck?: number;
	seatsUpperDeck?: number;
	standingCapacity?: number;
	vehicleSize?: VehicleSizes;
	numberOfSeatbelts?: string;
	seatbeltInstallationApprovalDate?: string;
	departmentalVehicleMarker?: boolean;
	approvalType?: ApprovalType;
	approvalTypeNumber?: string;
	ntaNumber?: string;
	coifSerialNumber?: string;
	coifCertifierName?: string;
	coifDate?: string | Date;
	variantNumber?: string;
	variantVersionNumber?: string;
	brakes?: Brakes;
	applicantDetails?: ApplicantDetails;
	microfilm?: Microfilm;
	remarks?: string;
	reasonForCreation?: string;
	modelLiteral?: string;
	make?: string;
	model?: string;
	chassisMake?: string;
	chassisModel?: string;
	bodyMake?: string;
	bodyModel?: string;
	bodyType?: BodyType;
	functionCode?: string;
	conversionRefNo?: string;
	purchaserDetails?: Purchaser;
	authIntoService?: AuthIntoService;
	notes?: string;
	vehicleSubclass?: Array<VehicleSubclass>;

	// Gross vehicle weights
	grossKerbWeight?: number;
	grossLadenWeight?: number;
	grossGbWeight?: number;
	grossEecWeight?: number;
	grossDesignWeight?: number;
	unladenWeight?: number;

	// Train weights
	trainDesignWeight?: number;
	trainEecWeight?: number;
	trainGbWeight?: number;

	// Max Train Weights
	maxTrainGbWeight?: number;
	maxTrainDesignWeight?: number;
	maxTrainEecWeight?: number;

	// Dimensions
	dimensions?: Dimensions;
	frontAxleToRearAxle?: number;
	rearAxleToRearTrl?: number;

	// Front of vehicle to 5th wheel coupling
	frontVehicleTo5thWheelCouplingMin?: number;
	frontVehicleTo5thWheelCouplingMax?: number;

	// Front axle to 5th wheel
	frontAxleTo5thWheelMin?: number;
	frontAxleTo5thWheelMax?: number;

	// Coupling center to rear axle
	couplingCenterToRearAxleMin?: number;
	couplingCenterToRearAxleMax?: number;

	// Coupling center to rear trailer
	couplingCenterToRearTrlMin?: number;
	couplingCenterToRearTrlMax?: number;
	plates?: Plates[];
	letterOfAuth?: LettersOfAuth;
	dda?: DDA;
	updateType?: string;

	recordCompleteness?: string;
	hiddenInVta?: boolean;
}

export interface AuthIntoService {
	cocIssueDate?: string | null;
	dateReceived?: string | null;
	datePending?: string | null;
	dateAuthorised?: string | null;
	dateRejected?: string | null;
}

export interface DDA {
	certificateIssued?: boolean;
	wheelchairCapacity?: number;
	wheelchairFittings?: string;
	wheelchairLiftPresent?: boolean;
	wheelchairLiftInformation?: string;
	wheelchairRampPresent?: boolean;
	wheelchairRampInformation?: string;
	minEmergencyExits?: number;
	outswing?: string;
	ddaSchedules?: string;
	seatbeltsFitted?: number;
	ddaNotes?: string;
}

export interface Plates {
	plateSerialNumber?: string;
	plateIssueDate?: Date;
	plateReasonForIssue?: PlateReasonForIssue;
	plateIssuer?: string;
}

export enum PlateReasonForIssue {
	FREE_REPLACEMENT = 'Free replacement',
	REPLACEMENT = 'Replacement',
	DESTROYED = 'Destroyed',
	PROVISIONAL = 'Provisional',
	ORIGINAL = 'Original',
	MANUAL = 'Manual',
}

export interface ApplicantDetails {
	name?: string;
	address1?: string;
	address2?: string;
	postTown?: string;
	address3?: string;
	postCode?: string;
	telephoneNumber?: string;
	emailAddress?: string;
}

export interface Dimensions {
	height?: number;
	length?: number;
	width?: number;
	axleSpacing?: AxleSpacing[];
}

export interface AxleSpacing {
	axles?: string;
	value?: number | null;
}

export interface Brakes {
	dtpNumber?: string;
	loadSensingValve?: string; // TODO: Check from here if these types are correct
	antilockBrakingSystem?: string;
	axleNumber?: string;
	axleBrakeProperties?: AxleBrakeProperties; // Check to here and including object
	brakeCode?: string;
	brakeCodeOriginal?: string;
	dataTrBrakeOne?: string;
	dataTrBrakeTwo?: string;
	dataTrBrakeThree?: string;
	retarderBrakeOne?: Retarders;
	retarderBrakeTwo?: Retarders;
	brakeForceWheelsNotLocked?: BrakeForceWheelsNotLocked;
	brakeForceWheelsUpToHalfLocked?: BrakeForceWheelsUpToHalfLocked;
}

export interface BrakeForceWheelsNotLocked {
	parkingBrakeForceA?: number;
	secondaryBrakeForceA?: number;
	serviceBrakeForceA?: number;
}

export interface BrakeForceWheelsUpToHalfLocked {
	parkingBrakeForceB?: number;
	secondaryBrakeForceB?: number;
	serviceBrakeForceB?: number;
}
export enum Retarders {
	ELECTRIC = 'electric',
	EXHAUST = 'exhaust',
	FRICTION = 'friction',
	HYDRAULIC = 'hydraulic',
	OTHER = 'other',
	NONE = 'none',
}

export interface AxleBrakeProperties {
	brakeActuator?: string;
	leverLength?: string;
	springBrakeParking?: boolean;
}

export interface Microfilm {
	microfilmDocumentType?: MicrofilmDocumentType;
	microfilmRollNumber?: string;
	microfilmSerialNumber?: string;
}

export enum MicrofilmDocumentType {
	PSVMisc = 'PSV Miscellaneous',
	AAT = 'AAT - Trailer Annual Test',
	AIV = 'AIV - HGV International App',
	COIFMod = 'COIF Modification',
	Trailer = 'Trailer COC + Int Plate',
	RCT = 'RCT - Trailer Test Cert paid',
	HGV = 'HGV COC + Int Plate',
	PSVCarry = 'PSV Carry/Auth',
	OMORep = 'OMO Report',
	AIT = 'AIT - Trailer International App',
	IPV = 'IPV - HGV EEC Plate/Cert',
	XCV = 'XCV - HGV Test Cert free',
	AAV = 'AAV - HGV Annual Test',
	COIFMaster = 'COIF Master',
	Tempo100 = 'Tempo 100 Sp Ord',
	Deleted = 'Deleted',
	PSVNalt = 'PSV N/ALT',
	XPT = 'XPT - Tr Plating Cert paid',
	FFV = 'FFV - HGV First Test',
	Repl = 'Repl Vitesse 100',
	TCV = 'TCV - HGV Test Cert',
	ZZZ = 'ZZZ -  Miscellaneous',
	Test = 'Test Certificate',
	XCT = 'XCT - Trailer Test Cert free',
	C52 = 'C52 - COC and VTG52A',
	Tempo100Rep = 'Tempo 100 Report',
	Main = 'Main File Amendment',
	PSVDoc = 'PSV Doc',
	PSVCOC = 'PSV COC',
	PSVReplCOC = 'PSV Repl COC',
	TAV = 'TAV - COC',
	NPT = 'NPT - Trailer Alteration',
	OMO = 'OMO Certificate',
	PSVReplCOIF = 'PSV Repl COIF',
	PSVReplCOF = 'PSV Repl COF',
	COIFApp = 'COIF Application',
	XPV = 'XPV - HGV Plating Cert Free',
	TCT = 'TCT  - Trailer Test Cert',
	Tempo100App = 'Tempo 100 App',
	PSV = 'PSV Decision on N/ALT',
	Special = 'Special Order PSV',
	NPV = 'NPV - HGV Alteration',
	No = 'No Description Found',
	Vitesse = 'Vitesse 100 Sp Ord',
	Brake = 'Brake Test Details',
	COIF = 'COIF Productional',
	RDT = 'RDT - Test Disc Paid',
	RCV = 'RCV -  HGV Test Cert',
	FFT = 'FFT -  Trailer First Test',
	IPT = 'IPT - Trailer EEC Plate/Cert',
	XDT = 'XDT - Test Disc Free',
	PRV = 'PRV - HGV Plating Cert paid',
	COF = 'COF Cert',
	PRT = 'PRT - Tr Plating Cert paid',
	Tempo = 'Tempo 100 Permit',
}
