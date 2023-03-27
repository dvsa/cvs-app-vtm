import { Injectable } from '@angular/core';
import { Axle, AxleSpacing } from '@models/vehicle-tech-record.model';
import cloneDeep from 'lodash.clonedeep';

@Injectable({
  providedIn: 'root'
})
export class AxlesService {
  normaliseAxles(axles?: Axle[], axleSpacings?: AxleSpacing[]): [Axle[] | undefined, AxleSpacing[] | undefined] {
    let newAxles = cloneDeep(axles ?? []);
    let newAxleSpacings = cloneDeep(axleSpacings ?? []);

    if (newAxles.length > newAxleSpacings.length + 1) {
      newAxleSpacings = this.generateAxleSpacing(newAxles.length, newAxleSpacings);
    } else if (newAxles.length < newAxleSpacings.length + 1) {
      newAxles = this.generateAxlesFromAxleSpacings(newAxleSpacings.length, newAxles);
    }

    return [newAxles, newAxleSpacings];
  }

  sortAxle(axles?: Axle[]): Axle[] {
    return axles?.sort((a, b) => a.axleNumber! - b.axleNumber!) ?? [];
  }

  generateAxleSpacing(numberOfAxles: number, axleSpacingOriginal?: AxleSpacing[]): AxleSpacing[] {
    const axleSpacing: AxleSpacing[] = [];

    let axleNumber = 1;
    while (axleNumber < numberOfAxles) {
      axleSpacing.push({
        axles: `${axleNumber}-${axleNumber + 1}`,
        value: axleSpacingOriginal && axleSpacingOriginal[axleNumber - 1] ? axleSpacingOriginal[axleNumber - 1].value : null
      });
      axleNumber++;
    }

    return axleSpacing;
  }

  generateAxlesFromAxleSpacings(vehicleAxleSpacingsLength: number, previousAxles?: Axle[]): Axle[] {
    const axles = previousAxles ?? [];

    for (let i = axles.length; i < vehicleAxleSpacingsLength + 1; i++) {
      axles.push(this.generateEmptyAxle(i + 1));
    }

    return axles;
  }

  generateEmptyAxle(axleNumber: number): Axle {
    const weights = { gbWeight: null, eecWeight: null, designWeight: null };

    const tyres = { tyreSize: null, fitmentCode: null, dataTrAxles: null, plyRating: null, tyreCode: null };

    return { axleNumber, weights, tyres };
  }
}
