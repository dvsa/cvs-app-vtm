import { AdrDetails } from './../models/adr-details';
import { Injectable } from '@angular/core';

import { TechRecord } from '@app/models/tech-record.model';
import { SelectOption } from '@app/models/select-option';
import { NOTES, SUBSTANCES, MEMOS } from '@app/app.enums';

@Injectable({ providedIn: 'root' })
export class TechnicalRecordValuesMapper {
  constructor() {}

  mapToAllowedValues(techRecord: TechRecord): TechRecord {
    // In prep for saving techRecord, this is not needed
    techRecord.statusCode = undefined;
    techRecord.adrDetails = this.mapToAdrAllowedValues(techRecord);

    return techRecord;
  }

  mapToAdrAllowedValues({ adrDetails }: { adrDetails: AdrDetails }): AdrDetails {
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
        : '';
    adrDetails.tank.tankStatement.substancesPermitted = substancePermitted;

    const memoApplied: boolean = adrDetails.memosApply as any;
    adrDetails.memosApply = memoApplied ? [MEMOS.MEMOSAPPLY] : [];

    const { tankStatement } = adrDetails.tank;
    const { substanceReferenceSelect: _, ...tankStmt } = tankStatement as any;
    adrDetails.tank.tankStatement = tankStmt;

    return adrDetails;
  }

  getSelectedOptions(options: SelectOption[]): string[] {
    return options
      .filter((option: SelectOption) => option.selected)
      .map((option: SelectOption) => option.name);
  }
}
