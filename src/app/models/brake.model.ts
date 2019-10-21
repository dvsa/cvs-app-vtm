import {BrakeForceWheelModel} from '@app/models/brake-force-wheel.model';

export interface BrakeModel {
  brakeCode: string;
  dataTrBrakeOne: string;
  dataTrBrakeTwo: string;
  dataTrBrakeThree: string;
  retarderBrakeOne: string;
  retarderBrakeTwo: string;
  brakeCodeOriginal: string;
  brakeForceWheelsNotLocked: BrakeForceWheelModel;
  brakeForceWheelsUpToHalfLocked: BrakeForceWheelModel;
}
