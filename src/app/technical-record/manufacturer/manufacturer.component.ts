import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { ManufacturerDetails } from '@app/models/tech-record.model';

@Component({
  selector: 'vtm-manufacturer',
  templateUrl: './manufacturer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManufacturerComponent implements OnInit {

  @Input() manufacturer: ManufacturerDetails;
  address1And2 = '';
  constructor() { }

  ngOnInit() {
    if (this.manufacturer) {
      this.address1And2 = `${this.manufacturer.address1} ${this.manufacturer.address2}`;
    }
  }

}
