import {WeightsModel} from '@app/models/weights.model';
import {TyresModel} from '@app/models/tyres.model';

export interface AxelsModel {
  parkingBrakeMrk: boolean;
  axleNumber: number;
  weights: WeightsModel;
  tyres: TyresModel;
}
