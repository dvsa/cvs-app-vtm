import { BrakeForceWheelsNotLocked } from './brakeForceWheelsNotLocked';
import { BrakeForceWheelsUpToHalfLocked } from './brakeForceWheelsUpToHalfLocked';

export interface Brakes { 
    /**
     * Used only for PSV
     */
    brakeCodeOriginal?: string;
    /**
     * Used only for PSV
     */
    brakeCode?: string;
    /**
     * Used only for PSV
     */
    dataTrBrakeOne?: string;
    /**
     * Used only for PSV
     */
    dataTrBrakeTwo?: string;
    /**
     * Used only for PSV
     */
    dataTrBrakeThree?: string;
    /**
     * Used only for PSV
     */
    retarderBrakeOne?: Brakes.RetarderBrakeOneEnum;
    /**
     * Used only for PSV
     */
    retarderBrakeTwo?: Brakes.RetarderBrakeTwoEnum;
    /**
     * Used for PSV, HGV and TRL
     */
    dtpNumber?: string;
    brakeForceWheelsNotLocked?: BrakeForceWheelsNotLocked;
    brakeForceWheelsUpToHalfLocked?: BrakeForceWheelsUpToHalfLocked;
    /**
     * Used only for TRL
     */
    loadSensingValve?: boolean;
    /**
     * Used only for TRL
     */
    antilockBrakingSystem?: boolean;
}
export namespace Brakes {
    export type RetarderBrakeOneEnum = 'electric' | 'exhaust' | 'friction' | 'hydraulic' | 'other' | 'none';
    export const RetarderBrakeOneEnum = {
        Electric: 'electric' as RetarderBrakeOneEnum,
        Exhaust: 'exhaust' as RetarderBrakeOneEnum,
        Friction: 'friction' as RetarderBrakeOneEnum,
        Hydraulic: 'hydraulic' as RetarderBrakeOneEnum,
        Other: 'other' as RetarderBrakeOneEnum,
        None: 'none' as RetarderBrakeOneEnum
    };
    export type RetarderBrakeTwoEnum = 'electric' | 'exhaust' | 'friction' | 'hydraulic' | 'other' | 'none';
    export const RetarderBrakeTwoEnum = {
        Electric: 'electric' as RetarderBrakeTwoEnum,
        Exhaust: 'exhaust' as RetarderBrakeTwoEnum,
        Friction: 'friction' as RetarderBrakeTwoEnum,
        Hydraulic: 'hydraulic' as RetarderBrakeTwoEnum,
        Other: 'other' as RetarderBrakeTwoEnum,
        None: 'none' as RetarderBrakeTwoEnum
    };
}