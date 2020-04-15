import { AdrDetails } from '../models/adr-details';
import { Injectable } from '@angular/core';

import { TechRecord, Axle, Dimensions, AxleSpacing } from '@app/models/tech-record.model';
import { VehicleTechRecordEdit } from '@app/models/vehicle-tech-record.model';
import { SelectOption } from '@app/models/select-option';
import { NOTES, SUBSTANCES, MEMOS } from '@app/app.enums';
import { DocumentMetaData } from '../models/document-meta-data';

@Injectable({ providedIn: 'root' })
export class TechnicalRecordValuesMapper {
  constructor() {}

  mapControlValuesToDataValues(vehicleRecord): VehicleTechRecordEdit {
    vehicleRecord.techRecord = this.mapToTechRecordAllowedValues(vehicleRecord);
    return vehicleRecord;
  }

  private mapToTechRecordAllowedValues({ techRecord }: { techRecord: TechRecord }): TechRecord[] {
    const {
      axles,
      axlesWeights,
      axlesTyres,
      dimensions,
      adrDetails,
      ...techRecordTemp
    } = techRecord as any;

    techRecordTemp.updateType = undefined;
    techRecordTemp.axles = this.mapToAxlesAllowdeValues({ axles, axlesWeights, axlesTyres });
    techRecordTemp.dimensions = this.mapToDimensionsAllowedValued({ dimensions });
    techRecordTemp.adrDetails = this.mapToAdrAllowedValues(adrDetails);
    return [techRecordTemp];
  }

  private mapToAxlesAllowdeValues(params): Axle[] {
    const { axles, axlesWeights, axlesTyres } = params;

    const axlesTemp: Axle[] =
      axles &&
      (axles as any[]).map((axle, i) => {
        return {
          axleNumber: axle.axleNumber,
          parkingBrakeMrk: axle.selected,
          weights: axlesWeights[i].weights,
          tyres: axlesTyres[i].tyres
        } as Axle;
      });

    return axlesTemp;
  }

  private mapToDimensionsAllowedValued(params): Dimensions {
    const { dimensions } = params;

    if (dimensions) {
      const axlesSpacingTemp: AxleSpacing[] = dimensions.axleSpacing.map(({ axles, value }) => {
        return { axles, value };
      });

      dimensions.axleSpacing = axlesSpacingTemp;

      return dimensions;
    }
  }

  private mapToAdrAllowedValues(adrDetails: AdrDetails): AdrDetails {
    if (!adrDetails || !Object.keys(adrDetails).length) {
      return null;
    }

    // adr-details component
    const modelDangerousGoods: SelectOption[] = adrDetails.permittedDangerousGoods as any[];
    adrDetails.permittedDangerousGoods = this.getSelectedOptions(modelDangerousGoods);

    const notesNumber: SelectOption[] = adrDetails.additionalNotes.number as any[];
    adrDetails.additionalNotes.number = this.getSelectedOptions(notesNumber);

    const noteRequested: boolean = adrDetails.additionalNotes.guidanceNotes as any;
    adrDetails.additionalNotes.guidanceNotes = noteRequested ? [NOTES.GUIDANCENOTE] : [];

    const substancePermitted =
      adrDetails.tank.tankStatement.substancesPermitted === SUBSTANCES.CLASSNUMBER
        ? SUBSTANCES.CLASSNUMBER_TEXT
        : adrDetails.tank.tankStatement.substancesPermitted === SUBSTANCES.PERMITTED
        ? SUBSTANCES.PERMITTED_TEXT
        : null;
    adrDetails.tank.tankStatement.substancesPermitted = substancePermitted;

    const memoApplied: boolean = adrDetails.memosApply as any;
    adrDetails.memosApply = memoApplied ? [MEMOS.MEMOSAPPLY] : [];

    const documentMetaData: DocumentMetaData[] = adrDetails.documents as any[];
    adrDetails.documents = documentMetaData.map((doc) => doc.metaName);

    const { tankStatement } = adrDetails.tank;
    const { substanceReferenceSelect: _, ...tankStmt } = tankStatement as any;
    adrDetails.tank.tankStatement = tankStmt;

    const { productListUnNo } = adrDetails.tank.tankStatement;
    adrDetails.tank.tankStatement.productListUnNo = this.processListUnNo(productListUnNo);

    adrDetails.weight = adrDetails.weight ? (+adrDetails.weight / 1000).toString() : null;

    return adrDetails;
  }

  processListUnNo(listUnNno: string[]): string[] {
    const tempList: string[] = [];
    listUnNno.map((unNo) => {
      if (unNo) {
        tempList.push(unNo);
      }
    });

    return tempList;
  }

  getSelectedOptions(options: SelectOption[]): string[] {
    return options
      .filter((option: SelectOption) => option.selected)
      .map((option: SelectOption) => option.name);
  }
}
