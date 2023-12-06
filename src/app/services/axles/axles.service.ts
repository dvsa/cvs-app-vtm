import { Injectable } from '@angular/core';
import { HGVAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/hgv/complete';
import { PSVAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/psv/skeleton';
import { TRLAxles } from '@dvsa/cvs-type-definitions/types/v3/tech-record/get/trl/complete';
import { AxleSpacing } from '@models/vehicle-tech-record.model';
import cloneDeep from 'lodash.clonedeep';

@Injectable({
  providedIn: 'root',
})
export class AxlesService {
  normaliseAxles(
    axles?: HGVAxles[] | PSVAxles[] | TRLAxles[],
    axleSpacings?: AxleSpacing[],
  ): [HGVAxles[] | PSVAxles[] | TRLAxles[] | undefined, AxleSpacing[] | undefined] {
    let newAxles = cloneDeep(axles ?? []);
    let newAxleSpacings = cloneDeep(axleSpacings ?? []);

    if (newAxles.length > newAxleSpacings.length + 1) {
      newAxleSpacings = this.generateAxleSpacing(newAxles.length, newAxleSpacings);
    } else if (newAxles.length < newAxleSpacings.length + 1 && newAxles.length) {
      newAxles = this.generateAxlesFromAxleSpacings(newAxleSpacings.length, newAxles);
    }

    newAxles.sort((a, b) => (a.axleNumber ?? 0) - (b.axleNumber ?? 0));

    return [newAxles, newAxleSpacings];
  }

  generateAxleSpacing(numberOfAxles: number, axleSpacingOriginal?: AxleSpacing[]): AxleSpacing[] {
    const axleSpacing: AxleSpacing[] = [];

    let axleNumber = 1;
    while (axleNumber < numberOfAxles) {
      axleSpacing.push({
        axles: `${axleNumber}-${axleNumber + 1}`,
        value: axleSpacingOriginal && axleSpacingOriginal[axleNumber - 1] ? axleSpacingOriginal[axleNumber - 1].value : null,
      });
      axleNumber++;
    }

    return axleSpacing;
  }

  generateAxlesFromAxleSpacings(
    vehicleAxleSpacingsLength: number,
    previousAxles?: HGVAxles[] | PSVAxles[] | TRLAxles[],
  ): HGVAxles[] | PSVAxles[] | TRLAxles[] {
    const axles = previousAxles ?? [];

    for (let i = axles.length; i < vehicleAxleSpacingsLength + 1; i++) {
      axles.push(this.generateEmptyAxle(i + 1));
    }

    return axles;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateEmptyAxle(axleNumber: number): any {
    return {
      axleNumber,
      weights_gbWeight: null,
      weights_eecWeight: null,
      weights_designedWeight: null,
      tyres_tyreSize: null,
      tyres_fitmentCode: null,
      tyres_dataTrAxles: null,
      tyres_plyRating: null,
      tyres_tyreCode: null,
    };
  }
}
