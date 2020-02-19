import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { AdrDetails } from '@app/models/adr-details';
import { NOTES } from '@app/app.enums';

@Component({
  selector: 'vtm-certificate',
  templateUrl: './certificate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificateComponent implements OnInit {
  @Input() edit: boolean;
  @Input() adrDetails: AdrDetails;

  isCertificateRequested: boolean;

  constructor() {}

  ngOnInit() {
    this.isCertificateRequested = !!this.getCertificateRequested(
      this.adrDetails.additionalNotes.guidanceNotes
    );
  }

  getCertificateRequested(notes: string[]) {
    return notes.find((value) => NOTES.GUIDANCENOTE_CODE === this.mapGuidanceNotesToCodes(value));
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
