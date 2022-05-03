import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { PsvTechRecord } from '../../forms/templates/psv/psv-tech-record.template';
import { HgvTechRecord } from '../../forms/templates/hgv/hgv-tech-record.template';
import { TrlTechRecord } from '../../forms/templates/trl/trl-tech-record.template';
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
  currentRecord!: TechRecordModel | undefined;

  ngOnInit(): void {
    this.vehicleTemplate();
    this.currentRecord = this.viewableTechRecord(this.vehicleTechRecord);
  }

  constructor() {}

  viewableTechRecord(record: VehicleTechRecordModel): TechRecordModel | undefined {
    let viewableTechRecord = record?.techRecord?.find((record) => record.statusCode === StatusCodes.PROVISIONAL);
    if (viewableTechRecord == undefined) {
      viewableTechRecord = record?.techRecord?.find((record) => record.statusCode === StatusCodes.CURRENT);
    }
    if (viewableTechRecord == undefined) {
      viewableTechRecord = record?.techRecord?.find((record) => record.statusCode === StatusCodes.ARCHIVED);
    }
    return viewableTechRecord;
  }

  get vehicleType(): string | undefined {
    return this.vehicleTechRecord?.techRecord.pop()?.vehicleType;
  }

  vehicleTemplate(): void {
    let viewableRecord = this.viewableTechRecord(this.vehicleTechRecord);
    switch (viewableRecord?.vehicleType) {
      case 'psv': {
        this.template = PsvTechRecord;
        break;
      }
      case 'hgv': {
        this.template = HgvTechRecord;
        break;
      }
      case 'trl': {
        this.template = TrlTechRecord;
        break;
      }
      default: {
        break;
      }
    }
  }
}
