export interface BodyType {
  code: string;
  description: string;
}

export interface IBody {
  make: string;
  model: string;
  functionCode: string;
  conversionRefNo: string;
  bodyType: BodyType;
}

export interface BodyPSV extends Body {
  chassisMake: string;
  chassisModel: string;
}
