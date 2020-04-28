import { Component, ChangeDetectionStrategy, Input, OnInit } from '@angular/core';

import { AdrDetails } from '@app/models/adr-details';

@Component({
  selector: 'vtm-battery-list-applicable',
  templateUrl: './battery-list-applicable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BatteryListApplicableComponent implements OnInit {
  @Input() edit: boolean;
  @Input() adrDetails: AdrDetails;

  constructor() {}

  ngOnInit(): void {}
}
