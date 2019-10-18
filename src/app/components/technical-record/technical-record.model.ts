export class Axle {
    AxleNumber: number;
    TyreSize: string;
    SpeedCategorySymbol: string;
    FitmentCode: string;
    DataTrAxles: number;
    PlyRating: string;
    TyreCode: number;
    ParkingBrakeMrk: boolean;
    KerbWeight: number;
    GbWeight: number;
    LadenWeight: number;
    DesignWeight: number;
    public constructor(init?:Partial<Axle>) {
        Object.assign(this, init);
    }
}

export class TechnicalRecordModel {
    StatusCode: string;
    BodyDescription: string;
    GrossKerbWeight: string;
    BrakeCode: string;
    LastUpdatedAt: string;
    SeatsUpperDeck: number;
    StandingCapacity: number;
    BrakeCodeOriginal: string;
    BreakCode: string;
    RetarderBrakeOne: string;
    UnlkParkBrakeForce: number;
    UnlkSvcBrakeForce: number;
    UnlkSecBrakeForce: number;
    DataTrBrakeTwo: string;
    BodyModel: string;
    BodyMake: string;
    ConversionRefNo: string;
    GrossLadenWeight: number;
    ChassisModel: string;
    NoOfAxles: number;
    VehicleType: string;
    SeatsLowerDeck: number;
    details: Axle[];

    public constructor(init?:Partial<TechnicalRecordModel>) {
        Object.assign(this, init);
    }
}