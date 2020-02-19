import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { TechRecordHelpersService } from '@app/technical-record/tech-record-helpers.service';
import { AdrDetails } from '@app/models/adr-details';

@Component({
  selector: 'vtm-declaration-seen',
  templateUrl: './declaration-seen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeclarationSeenComponent implements OnInit {
  @Input() edit: boolean;
  @Input() adrDetails: AdrDetails;

  hasNullEmptyWeight: boolean;
  weight: number;

  constructor() {}

  ngOnInit() {
    this.hasNullEmptyWeight = !this.adrDetails.weight;
    if (!this.hasNullEmptyWeight) {
      this.weight = +this.adrDetails.weight * 1000;
    }
  }
}
