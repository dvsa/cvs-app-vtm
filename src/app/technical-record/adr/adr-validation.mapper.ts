import { Injectable } from '@angular/core';

enum CHECKER {
  BATTERY = 'battery',
  TANK = 'tank',
  NONE = 'na'
}

enum STATUS {
  MANDATORY = 'MANDATORY',
  HIDDEN = 'HIDDEN'
}

export interface ValidationStatus {
  TankDetailsEditComponent: object | STATUS;
  TankDocumentsComponent: object | STATUS;
  TankInspectionsEditComponent: object | STATUS;
  MemoEditComponent: object | STATUS;
  BatteryListApplicableEditComponent: object | STATUS;
}

@Injectable({ providedIn: 'root' })
export class ValidationMapper {
  constructor() {}

  mapVehicleTypeToValidationStatus(selectedType: string) {
    const validationStatus = {
      [CHECKER.BATTERY]: () => this.getBatteryTypeValidationStatus(),
      [CHECKER.TANK]: () => this.getTankTypeValidationStatus(),
      [CHECKER.NONE]: () => this.getOtherTypeValidationStatus()
    };

    return validationStatus[this.getType(selectedType)]();
  }

  private getType(type: string): string {
    if (type.trim().includes(CHECKER.BATTERY)) {
      return CHECKER.BATTERY;
    }

    if (type.includes(CHECKER.TANK)) {
      return CHECKER.TANK;
    }

    return CHECKER.NONE;
  }

  private getBatteryTypeValidationStatus() {
    return {
      TankDetailsEditComponent: {
        tankManufacturer: STATUS.MANDATORY,
        yearOfManufacture: STATUS.MANDATORY,
        tankManufacturerSerialNo: STATUS.MANDATORY,
        tankTypeAppNo: STATUS.MANDATORY,
        tankCode: STATUS.MANDATORY,
        substancesPermitted: STATUS.MANDATORY
      }
    };
  }

  private getTankTypeValidationStatus() {
    return {
      TankDetailsEditComponent: {
        tankManufacturer: STATUS.MANDATORY,
        yearOfManufacture: STATUS.MANDATORY,
        tankManufacturerSerialNo: STATUS.MANDATORY,
        tankTypeAppNo: STATUS.MANDATORY,
        tankCode: STATUS.MANDATORY,
        substancesPermitted: STATUS.MANDATORY
      },
      BatteryListApplicableEditComponent: STATUS.HIDDEN
    };
  }

  private getOtherTypeValidationStatus() {
    return {
      TankDetailsEditComponent: STATUS.HIDDEN,
      TankDocumentsComponent: STATUS.HIDDEN,
      TankInspectionsEditComponent: STATUS.HIDDEN,
      MemoEditComponent: STATUS.HIDDEN,
      BatteryListApplicableEditComponent: STATUS.HIDDEN
    };
  }
}
