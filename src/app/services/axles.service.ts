import { Injectable } from '@angular/core';
import { Axle, AxleSpacing } from '@models/vehicle-tech-record.model';
import cloneDeep from 'lodash.clonedeep';

@Injectable({
  providedIn: 'root'
})
export class AxlesService {
  normaliseAxles(axles?: Axle[], axleSpacings?: AxleSpacing[]): [Axle[] | undefined, AxleSpacing[] | undefined] {
    let newAxles = cloneDeep(axles);
    let newAxleSpacings = cloneDeep(axleSpacings);

    if (axles && axleSpacings) {
      if (axles.length > axleSpacings.length + 1) {
        newAxleSpacings = this.generateAxleSpacing(axles.length, true, axleSpacings);
      } else if (axles.length < axleSpacings.length + 1) {
        newAxles = this.generateAxlesFromAxleSpacings(axleSpacings.length, axles);
      }
    } else if (axles && !axleSpacings) {
      newAxleSpacings = this.generateAxleSpacing(axles.length);
    } else if (!axles && axleSpacings?.length) {
      newAxles = this.generateAxlesFromAxleSpacings(axleSpacings.length);
    }

    return [newAxles, newAxleSpacings];
  }

  generateAxleSpacing(numberOfAxles: number, setOriginalValues: boolean = false, axleSpacingOriginal?: AxleSpacing[]): AxleSpacing[] {
    let axleSpacing: AxleSpacing[] = [];

    let axleNumber = 1;
    while (axleNumber < numberOfAxles) {
      axleSpacing.push({
        axles: `${axleNumber}-${axleNumber + 1}`,
        value: setOriginalValues && axleSpacingOriginal && axleSpacingOriginal[axleNumber - 1] ? axleSpacingOriginal[axleNumber - 1].value : null
      });
      axleNumber++;
    }

    return axleSpacing;
  }

  generateAxlesFromAxleSpacings(vehicleAxleSpacingsLength: number, previousAxles?: Axle[]): Axle[] {
    const axles = previousAxles ?? [];

    let i = previousAxles ? previousAxles.length : 0;

    for (i; i < vehicleAxleSpacingsLength + 1; i++) {
      axles.push(this.generateEmptyAxle(i + 1));
    }

    return axles;
  }

  generateEmptyAxle(axleNumber: number): Axle {
    const weights = { gbWeight: null, eecWeight: null, designWeight: null };

    const tyres = { tyreSize: null, speedCategorySymbol: null, fitmentCode: null, dataTrAxles: null, plyRating: null, tyreCode: null };

    return { axleNumber, weights, tyres };
  }
}
