import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { PsvTechRecord } from '../../forms/templates/psv/psv-tech-record.template';
import { FormNode } from '../../forms/services/dynamic-form.service';

@Component({
  selector: 'app-tech-record-summary',
  templateUrl: './tech-record-summary.component.html',
  styleUrls: ['./tech-record-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechRecordSummaryComponent {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  template!: FormNode;

  constructor() {
    this.vehicleTemplate();
  }
  
  get vehicleType(): string | undefined {
    return this.vehicleTechRecord?.techRecord.pop()?.vehicleType;
  }

  vehicleTemplate(): void  {
    switch(this.vehicleType) {
      case('psv'): {
        this.template = PsvTechRecord;
        break;
      }
      default: {
        break;
      }
    }
  }
}
