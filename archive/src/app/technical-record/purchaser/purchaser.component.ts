import {
  Component,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { PurchaserDetails, TechRecord } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-purchaser',
  templateUrl: './purchaser.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PurchaserComponent implements OnChanges {
  @Input() techRecord: TechRecord;

  address1And2: string;
  purchaser: PurchaserDetails;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const { techRecord } = changes;

    if (techRecord) {
      this.purchaser = !!this.techRecord.purchaserDetails
        ? this.techRecord.purchaserDetails
        : ({} as PurchaserDetails);

      this.address1And2 = Object.keys(this.purchaser).length
        ? `${this.purchaser.address1} ${this.purchaser.address2}`
        : '';
    }
  }
}
