/**
 * Disability Discrimination Act
 */
export interface Dda { 
    /**
     * Used only for PSV
     */
    certificateIssued?: boolean;
    /**
     * Used only for PSV
     */
    wheelchairCapacity?: number;
    /**
     * Used only for PSV
     */
    wheelchairFittings?: string;
    /**
     * Used only for PSV
     */
    wheelchairLiftPresent?: boolean;
    /**
     * Used only for PSV
     */
    wheelchairLiftInformation?: string;
    /**
     * Used only for PSV
     */
    wheelchairRampPresent?: boolean;
    /**
     * Used only for PSV
     */
    wheelchairRampInformation?: string;
    /**
     * Used only for PSV
     */
    minEmergencyExits?: number;
    /**
     * Used only for PSV
     */
    outswing?: string;
    /**
     * Used only for PSV
     */
    ddaSchedules?: string;
    /**
     * Used only for PSV
     */
    seatbeltsFitted?: number;
    /**
     * Used only for PSV
     */
    ddaNotes?: string;
}