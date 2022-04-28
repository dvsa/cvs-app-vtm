import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { PsvTechRecord } from '../../forms/templates/psv/psv-tech-record.template';
import { FormNode } from '../../forms/services/dynamic-form.service';

@Component({
  selector: 'app-tech-record-summary',
  templateUrl: './tech-record-summary.component.html',
  styleUrls: ['./tech-record-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechRecordSummaryComponent implements OnInit {
  @Input() vehicleTechRecord!: VehicleTechRecordModel;
  template!: FormNode;
  currentRecord!: TechRecordModel;

  ngOnInit(): void {
    this.vehicleTemplate();
    this.currentRecord = this.currentTechRecord(this.vehicleTechRecord)
  }

  constructor() {
  }

  currentTechRecord(record: VehicleTechRecordModel): TechRecordModel {
    return record?.techRecord?.find(record => record.statusCode === 'current')!
  }
  
  get vehicleType(): string | undefined {
    return this.vehicleTechRecord?.techRecord.pop()?.vehicleType;
  }

  vehicleTemplate(): void  {
    let currentRecord = this.currentTechRecord(this.vehicleTechRecord)
    switch(currentRecord?.vehicleType) {
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
