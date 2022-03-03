import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

enum CHECKER {
  BATTERY = 'battery',
  TANK = 'tank',
  NONE = 'na'
}

export enum STATUS {
  MANDATORY = 'MANDATORY',
  HIDDEN = 'HIDDEN'
}

export interface ValidationState {
  tankDetailsEdit?: STATUS;
  tankDocuments?: STATUS;
  tankInspectionsEdit?: STATUS;
  memoEdit?: STATUS;
  batteryListApplicableEdit?: STATUS;
}

@Injectable({ providedIn: 'root' })
export class ValidationMapper {
  _state = new Subject<ValidationState>();

  constructor() {}

  vehicleTypeSelected(selectedType: string): void {
    const selectedState: ValidationState = this.mapVehicleTypeToValidationState(selectedType);
    this._state.next(selectedState);
  }

  getCurrentState(): Observable<ValidationState> {
    return this._state.asObservable();
  }

  private mapVehicleTypeToValidationState(selectedType: string): ValidationState {
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

  private getBatteryTypeValidationStatus(): ValidationState {
    return {
      tankDetailsEdit: STATUS.MANDATORY
    };
  }

  private getTankTypeValidationStatus(): ValidationState {
    return {
      tankDetailsEdit: STATUS.MANDATORY,
      batteryListApplicableEdit: STATUS.HIDDEN
    };
  }

  private getOtherTypeValidationStatus(): ValidationState {
    return {
      tankDetailsEdit: STATUS.HIDDEN,
      tankDocuments: STATUS.HIDDEN,
      tankInspectionsEdit: STATUS.HIDDEN,
      memoEdit: STATUS.HIDDEN,
      batteryListApplicableEdit: STATUS.HIDDEN
    };
  }
}
