import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { StatusCodes, TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';

@Component({
  selector: 'app-tech-record-history[vehicle][currentTechRecord]',
  templateUrl: './tech-record-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tech-record-history.component.scss']
})
export class TechRecordHistoryComponent {
  @Input() vehicle!: VehicleTechRecordModel;
  @Input() currentTechRecord!: TechRecordModel;

  pageStart?: number;
  pageEnd?: number;

  constructor(private cdr: ChangeDetectorRef) {}

  get techRecords() {
    return this.vehicle.techRecord.slice(this.pageStart, this.pageEnd) ?? [];
  }

  get numberOfRecords(): number {
    return this.vehicle.techRecord.length || 0;
  }

  convertToUnix(date: Date): number {
    return new Date(date).getTime();
  }

  handlePaginationChange({ start, end }: { start: number; end: number }) {
    this.pageStart = start;
    this.pageEnd = end;
    this.cdr.detectChanges();
  }

  trackByFn(i: number, tr: TechRecordModel) {
    return tr.createdAt;
  }

  summaryLinkUrl(techRecord: TechRecordModel) {
    switch (techRecord.statusCode) {
      case StatusCodes.PROVISIONAL:
        return '/provisional';
      case StatusCodes.ARCHIVED:
        return `/historic/${this.convertToUnix(techRecord.createdAt)}`;
      default:
        return '';
    }
  }
}
