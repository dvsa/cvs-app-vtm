import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

import { AdrDetails } from '@app/models/adr-details';
import { MetaData } from '@app/models/meta-data';

@Component({
  selector: 'vtm-adr-new-details',
  templateUrl: './adr-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdrDetailsComponent implements OnInit {
  @Input() edit: boolean;
  @Input() adrDetails: AdrDetails;
  @Input() metaData: MetaData;

  constructor() {}

  ngOnInit() {}
}
