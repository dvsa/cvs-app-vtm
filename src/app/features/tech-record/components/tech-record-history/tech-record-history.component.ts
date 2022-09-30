import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
  selector: 'app-tech-record-history',
  templateUrl: './tech-record-history.component.html',
  styleUrls: ['./tech-record-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechRecordHistoryComponent {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  @Input() currentRecord?: TechRecordModel;
  @Input() currentPage: number = 1;

  itemsPerPage = 5;

  convertToUnix(date: Date): number {
    return new Date(date).getTime();
  }

  get numberOfRecords(): number {
    return this.vehicleTechRecord?.techRecord.length || 0;
  }

  get techRecords() {
    return this.vehicleTechRecord?.techRecord.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage) ?? [];
  }

  trackByFn(i: number, tr: TechRecordModel) {
    return tr.createdAt;
  }
}
