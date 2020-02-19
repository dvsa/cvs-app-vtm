import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { AdrDetails } from '@app/models/adr-details';

@Component({
  selector: 'vtm-additional-adr-details',
  templateUrl: './additional-adr-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdditionalAdrDetailsComponent implements OnInit {
  @Input() edit: boolean;
  @Input() adrDetails: AdrDetails;

  constructor() {}

  ngOnInit() {}
}
