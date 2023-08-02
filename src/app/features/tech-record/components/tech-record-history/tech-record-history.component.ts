import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { StatusCodes, TechRecordModel, V3TechRecordModel, VehicleTechRecordModel } from '@models/vehicle-tech-record.model';
import { TechnicalRecordService } from '@services/technical-record/technical-record.service';

@Component({
  selector: 'app-tech-record-history[vehicle][currentTechRecord]',
  templateUrl: './tech-record-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./tech-record-history.component.scss']
})
export class TechRecordHistoryComponent {
  @Input() vehicle!: V3TechRecordModel;
  @Input() currentTechRecord!: V3TechRecordModel;

  pageStart?: number;
  pageEnd?: number;

  constructor(private cdr: ChangeDetectorRef, private techRecordService: TechnicalRecordService) {}

  //TODO: implement a new way of getting tech records
  // get techRecords() {
  //   return this.vehicle.techRecord.slice(this.pageStart, this.pageEnd) ?? [];
  // }

  // get numberOfRecords(): number {
  //   return this.vehicle.techRecord.length || 0;
  // }

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
        return `/tech-records/${this.vehicle.systemNumber}/provisional`;
      case StatusCodes.ARCHIVED:
        return `/tech-records/${this.vehicle.systemNumber}/historic/${this.convertToUnix(techRecord.createdAt)}`;
      default:
        return `/tech-records/${this.vehicle.systemNumber}/`;
    }
  }
}
