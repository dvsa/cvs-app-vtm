import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
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

  currentPage = 1;
  itemsPerPage = 5;
  pageStart = 0;
  pageEnd = 5;

  constructor(private cdr: ChangeDetectorRef) {}

  convertToUnix(date: Date): number {
    return new Date(date).getTime();
  }

  handlePaginationChange({ currentPage, itemsPerPage, start, end }: { currentPage: number; itemsPerPage: number; start: number; end: number }) {
    this.currentPage = currentPage;
    this.itemsPerPage = itemsPerPage;
    this.pageStart = start;
    this.pageEnd = end;
    this.cdr.markForCheck();
  }

  get numberOfRecords(): number {
    return this.vehicleTechRecord?.techRecord.length || 0;
  }

  get techRecords() {
    return this.vehicleTechRecord?.techRecord.slice(this.pageStart, this.pageEnd) ?? [];
  }

  trackByFn(i: number, tr: TechRecordModel) {
    return tr.createdAt;
  }
}
