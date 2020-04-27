import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';

import { AdrDetails } from '@app/models/adr-details';
import { NOTES } from '@app/app.enums';

@Component({
  selector: 'vtm-certificate',
  templateUrl: './certificate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificateComponent implements OnChanges {
  @Input() edit: boolean;
  @Input() adrDetails: AdrDetails;

  isCertificateRequested: boolean;

  constructor() {}

  ngOnChanges(): void {
    const isAvailable =
      !!this.adrDetails.additionalNotes && !!this.adrDetails.additionalNotes.guidanceNotes;

    this.isCertificateRequested = isAvailable
      ? this.getCertificateRequested(this.adrDetails.additionalNotes)
      : null;
  }

  getCertificateRequested({ guidanceNotes }: { guidanceNotes: string[] }) {
    if (guidanceNotes) {
      return guidanceNotes.some(
        (value) => NOTES.GUIDANCENOTE_CODE === this.mapGuidanceNotesToCodes(value)
      );
    }
  }

  mapGuidanceNotesToCodes(value: string): string {
    if (value) {
      return value
        .toLowerCase()
        .trim()
        .replace(/ /gi, '');
    }
  }
}
