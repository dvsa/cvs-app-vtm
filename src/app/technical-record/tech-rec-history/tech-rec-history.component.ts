import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import { VehicleTechRecordModel } from '@app/models/vehicle-tech-record.model';

@Component({
  selector: 'vtm-tech-rec-history',
  templateUrl: './tech-rec-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechRecHistoryComponent implements OnInit {

  @Input() techRecordsJson: VehicleTechRecordModel;

  constructor() { }

  ngOnInit() {
  }

}
