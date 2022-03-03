import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';

import { AdrDetails } from '@app/models/adr-details';

@Component({
  selector: 'vtm-declaration-seen',
  templateUrl: './declaration-seen.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeclarationSeenComponent implements OnChanges {
  @Input() edit: boolean;
  @Input() adrDetails: AdrDetails;

  hasNullEmptyWeight: boolean;
  weight: number;

  constructor() {}

  ngOnChanges(): void {
    this.hasNullEmptyWeight = !this.adrDetails.weight;
    if (!this.hasNullEmptyWeight) {
      this.weight = +this.adrDetails.weight * 1000;
    }
  }
}
