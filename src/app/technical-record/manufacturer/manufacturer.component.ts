import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';

import { ManufacturerDetails, TechRecord } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-manufacturer',
  templateUrl: './manufacturer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManufacturerComponent implements OnChanges {
  @Input() techRecord: TechRecord;
  @Input() editState: boolean;

  address1And2: string;
  manufacturer: ManufacturerDetails;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const { techRecord } = changes;

    if (techRecord) {
      this.manufacturer = !!this.techRecord.manufacturerDetails
        ? this.techRecord.manufacturerDetails
        : ({} as ManufacturerDetails);

      this.address1And2 = Object.keys(this.manufacturer).length
        ? `${this.manufacturer.address1} ${this.manufacturer.address2}`
        : '';
    }
  }
}
