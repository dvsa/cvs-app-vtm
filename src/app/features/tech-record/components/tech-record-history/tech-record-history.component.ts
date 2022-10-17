import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
  selector: 'app-tech-record-history',
  templateUrl: './tech-record-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechRecordHistoryComponent {
  @Input() vehicleTechRecord?: VehicleTechRecordModel;
  @Input() currentRecord?: TechRecordModel;

  pageStart?: number;
  pageEnd?: number;

  constructor(private cdr: ChangeDetectorRef) {}

  convertToUnix(date: Date): number {
    return new Date(date).getTime();
  }

  handlePaginationChange({ start, end }: { start: number; end: number }) {
    this.pageStart = start;
    this.pageEnd = end;
    this.cdr.detectChanges();
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
