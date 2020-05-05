import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { PurchaserDetails } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-purchaser',
  templateUrl: './purchaser.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurchaserComponent implements OnInit {

  @Input() purchaser: PurchaserDetails;
  address1And2 = '';
  constructor() { }

  ngOnInit() {
    if (this.purchaser) {
      this.address1And2 = `${this.purchaser.address1} ${this.purchaser.address2}`;
    }
  }

}
